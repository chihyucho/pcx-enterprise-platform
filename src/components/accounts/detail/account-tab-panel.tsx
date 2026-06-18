"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AccountTabPanelProps {
  title: string;
  description?: string;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
}

export function AccountTabPanel({
  title,
  description,
  loading,
  error,
  onRetry,
  children,
}: AccountTabPanelProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading…
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <CardDescription className="text-destructive">
            {error}
          </CardDescription>
        </CardHeader>
        {onRetry ? (
          <CardContent>
            <Button variant="outline" size="sm" onClick={onRetry}>
              Try again
            </Button>
          </CardContent>
        ) : null}
      </Card>
    );
  }

  return <>{children}</>;
}
