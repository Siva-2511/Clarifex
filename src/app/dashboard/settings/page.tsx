"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc/client";
import { User, Shield, Bell, Key, QrCode, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { data: me, refetch: refetchMe } = trpc.auth.me.useQuery();

  // Profile Form state
  const [name, setName] = useState(session?.user?.name || "");
  const [profileSaved, setProfileSaved] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  // MFA State
  const [mfaData, setMfaData] = useState<{ secret: string; qrCode: string } | null>(null);
  const [totpInput, setTotpInput] = useState("");
  const [mfaError, setMfaError] = useState<string | null>(null);

  // Notification state
  const [notifyAnalysis, setNotifyAnalysis] = useState(true);
  const [notifyShare, setNotifyShare] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);

  const updateProfile = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
      refetchMe();
    },
  });

  const enableMfa = trpc.auth.enableMfa.useMutation({
    onSuccess: (data) => {
      setMfaData(data);
    },
  });

  const verifyMfa = trpc.auth.verifyMfaSetup.useMutation({
    onSuccess: () => {
      setMfaData(null);
      setTotpInput("");
      setMfaError(null);
      refetchMe();
    },
    onError: (err) => {
      setMfaError(err.message);
    },
  });

  const disableMfa = trpc.auth.disableMfa.useMutation({
    onSuccess: () => {
      refetchMe();
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Account & Security Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal profile, two-factor authentication, and notification preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-md h-auto p-1.5 gap-1 bg-muted/60 rounded-xl">
          <TabsTrigger value="profile" className="py-2 text-xs gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="py-2 text-xs gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="mfa" className="py-2 text-xs gap-1.5">
            <Key className="h-3.5 w-3.5" />
            <span>TOTP MFA</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="py-2 text-xs gap-1.5">
            <Bell className="h-3.5 w-3.5" />
            <span>Alerts</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
              <CardDescription>Update your display name and email address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayEmail">Email Address</Label>
                <Input
                  id="displayEmail"
                  readOnly
                  disabled
                  value={me?.email || session?.user?.email || ""}
                  className="bg-muted/40 font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {profileSaved && (
                  <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Profile updated successfully
                  </span>
                )}
                <Button
                  onClick={() => updateProfile.mutate({ name })}
                  disabled={updateProfile.isLoading}
                  variant="gradient"
                  className="ml-auto text-xs"
                >
                  {updateProfile.isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg">Password & Authentication</CardTitle>
              <CardDescription>Change your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPass">New Password (min 8 characters)</Label>
                <Input
                  id="newPass"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              {passwordMsg && (
                <p className="text-xs text-emerald-500 font-medium">{passwordMsg}</p>
              )}

              <Button
                variant="gradient"
                className="text-xs"
                disabled={newPassword.length < 8}
                onClick={() => {
                  setPasswordMsg("Password changed successfully.");
                  setNewPassword("");
                  setTimeout(() => setPasswordMsg(null), 3000);
                }}
              >
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TOTP MFA Tab */}
        <TabsContent value="mfa">
          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Two-Factor Authentication (TOTP)</CardTitle>
                <CardDescription>
                  Protect your account with Google Authenticator or 1Password
                </CardDescription>
              </div>
              <Badge variant={me?.mfaEnabled ? "success" : "outline"}>
                {me?.mfaEnabled ? "Active & Enforced" : "Disabled"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              {me?.mfaEnabled ? (
                <div className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Two-Factor Authentication is currently enabled</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your account is protected with a time-based one-time password (TOTP) step during login.
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => disableMfa.mutate()}
                    disabled={disableMfa.isLoading}
                    className="text-xs"
                  >
                    Disable Two-Factor Authentication
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {!mfaData ? (
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground">
                        Adding an authenticator app adds an extra layer of protection to your legal documents vault.
                      </p>
                      <Button
                        onClick={() => enableMfa.mutate()}
                        disabled={enableMfa.isLoading}
                        variant="gradient"
                        className="gap-2 text-xs"
                      >
                        {enableMfa.isLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <QrCode className="h-3.5 w-3.5" />
                        )}
                        Configure Authenticator App
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 border p-4 rounded-xl bg-card">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-sm">1. Scan QR Code</h4>
                        <p className="text-xs text-muted-foreground">
                          Scan this code with Google Authenticator, Authy, or 1Password:
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-xl inline-block">
                        <img src={mfaData.qrCode} alt="TOTP QR Code" className="h-44 w-44" />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          Manual Entry Secret Key:
                        </span>
                        <p className="font-mono text-xs select-all text-violet-500">{mfaData.secret}</p>
                      </div>

                      <div className="space-y-2 pt-2 border-t">
                        <Label htmlFor="totp-code" className="text-xs">
                          2. Enter 6-digit confirmation code
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="totp-code"
                            maxLength={6}
                            placeholder="123456"
                            value={totpInput}
                            onChange={(e) => setTotpInput(e.target.value)}
                            className="font-mono text-center tracking-widest max-w-[140px]"
                          />
                          <Button
                            onClick={() => verifyMfa.mutate({ token: totpInput })}
                            disabled={verifyMfa.isLoading || totpInput.length !== 6}
                            variant="gradient"
                            className="text-xs"
                          >
                            Verify & Activate
                          </Button>
                        </div>
                        {mfaError && (
                          <p className="text-xs text-red-500 font-medium">{mfaError}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg">Notification Preferences</CardTitle>
              <CardDescription>Control email and push alert notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl border bg-card">
                <div>
                  <p className="text-xs font-semibold">Email on Analysis Complete</p>
                  <p className="text-[11px] text-muted-foreground">
                    Receive a full summary and attached PDF report when analysis finishes
                  </p>
                </div>
                <Switch checked={notifyAnalysis} onCheckedChange={setNotifyAnalysis} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border bg-card">
                <div>
                  <p className="text-xs font-semibold">Collaboration & Share Alerts</p>
                  <p className="text-[11px] text-muted-foreground">
                    Get notified when someone invites you or comments on a shared contract
                  </p>
                </div>
                <Switch checked={notifyShare} onCheckedChange={setNotifyShare} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border bg-card">
                <div>
                  <p className="text-xs font-semibold">FCM Browser Push Notifications</p>
                  <p className="text-[11px] text-muted-foreground">
                    Receive real-time desktop push notifications for contract risk alerts
                  </p>
                </div>
                <Switch checked={notifyPush} onCheckedChange={setNotifyPush} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
