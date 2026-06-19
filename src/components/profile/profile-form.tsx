"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateProfileEmail,
  updateProfileName,
  updateProfilePassword,
} from "@/lib/profile/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProfileFormProps {
  fullName: string;
  email: string;
}

export function ProfileForm({ fullName, email }: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(fullName);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameSaving, setNameSaving] = useState(false);

  const [emailValue, setEmailValue] = useState(email);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailSaving, setEmailSaving] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  async function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNameSaving(true);
    setNameError(null);
    setNameSuccess(false);

    const result = await updateProfileName(name);
    if (!result.success) {
      setNameError(result.error);
    } else {
      setNameSuccess(true);
      router.refresh();
    }
    setNameSaving(false);
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailSaving(true);
    setEmailError(null);
    setEmailSuccess(false);

    const result = await updateProfileEmail(emailValue);
    if (!result.success) {
      setEmailError(result.error);
    } else {
      setEmailSuccess(true);
      router.refresh();
    }
    setEmailSaving(false);
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordSaving(true);
    const result = await updateProfilePassword(password);
    if (!result.success) {
      setPasswordError(result.error);
    } else {
      setPasswordSuccess(true);
      setPassword("");
      setConfirmPassword("");
    }
    setPasswordSaving(false);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>Update your display name.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Name</Label>
              <Input
                id="full_name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
            {nameError ? (
              <p className="text-sm text-destructive" role="alert">
                {nameError}
              </p>
            ) : null}
            {nameSuccess ? (
              <p className="text-sm text-muted-foreground">Name updated.</p>
            ) : null}
            <Button type="submit" disabled={nameSaving}>
              {nameSaving ? "Saving…" : "Save name"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email address</CardTitle>
          <CardDescription>
            Changing your email may require confirmation via your inbox.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            {emailError ? (
              <p className="text-sm text-destructive" role="alert">
                {emailError}
              </p>
            ) : null}
            {emailSuccess ? (
              <p className="text-sm text-muted-foreground">
                Email update requested. Check your inbox if confirmation is
                required.
              </p>
            ) : null}
            <Button type="submit" disabled={emailSaving}>
              {emailSaving ? "Saving…" : "Save email"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Set a new password for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm password</Label>
              <Input
                id="confirm_password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            {passwordError ? (
              <p className="text-sm text-destructive" role="alert">
                {passwordError}
              </p>
            ) : null}
            {passwordSuccess ? (
              <p className="text-sm text-muted-foreground">
                Password updated.
              </p>
            ) : null}
            <Button type="submit" disabled={passwordSaving}>
              {passwordSaving ? "Saving…" : "Save password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
