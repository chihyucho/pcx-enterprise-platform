"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createAccount } from "@/lib/accounts/actions";
import {
  createAccountSchema,
  type CreateAccountFormValues,
} from "@/lib/validations/account";
import { SOURCE_LABELS } from "@/lib/data/account-labels";
import type { CategoryOption, StageOption } from "@/lib/accounts/form-options";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SOURCE_OPTIONS = Object.entries(SOURCE_LABELS);

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "on_hold", label: "On Hold" },
] as const;

interface CreateAccountFormProps {
  categories: CategoryOption[];
  stages: StageOption[];
}

export function CreateAccountForm({
  categories,
  stages,
}: CreateAccountFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultStageId = stages[0]?.id ?? "";
  const defaultCategoryId = categories[0]?.id ?? "";

  const form = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      brandName: "",
      businessCategoryId: defaultCategoryId,
      stageId: defaultStageId,
      source: "inbound",
      status: "active",
    },
  });

  async function onSubmit(values: CreateAccountFormValues) {
    setSubmitError(null);
    const result = await createAccount(values);

    if (!result.success) {
      setSubmitError(result.error);
      return;
    }

    router.push(`/sales-system/accounts/${result.accountId}`);
    router.refresh();
  }

  const noLookupData = categories.length === 0 || stages.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account details</CardTitle>
        <CardDescription>
          Fields map to the <code className="text-xs">accounts</code> table in
          Supabase.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {noLookupData ? (
          <p className="text-sm text-destructive">
            No rows in <code className="text-xs">public.stages</code> or{" "}
            <code className="text-xs">public.business_categories</code>. Add
            lookup data in the Supabase Table Editor, then refresh.
          </p>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="brandName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Acme Corporation"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Column: <code className="text-xs">brand_name</code>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessCategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Column:{" "}
                      <code className="text-xs">business_category_id</code>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {stages.map((stage) => (
                          <SelectItem key={stage.id} value={stage.id}>
                            {stage.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Column: <code className="text-xs">stage_id</code>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SOURCE_OPTIONS.map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Column: <code className="text-xs">source</code>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Column: <code className="text-xs">status</code>{" "}
                      (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {submitError ? (
                <p className="text-sm text-destructive" role="alert">
                  {submitError}
                </p>
              ) : null}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" asChild>
                  <Link href="/sales-system/accounts">Cancel</Link>
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? "Creating..."
                    : "Create account"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
