"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { FieldError as RHFFieldError } from "react-hook-form"

const Field = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: "vertical" | "horizontal" | "responsive"
  }
>(({ className, orientation = "vertical", ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="field"
      data-orientation={orientation}
      className={cn(
        "flex flex-col gap-2",
        orientation === "horizontal" && "flex-row items-center gap-4",
        orientation === "responsive" && "flex-col gap-2 sm:flex-row sm:items-center sm:gap-4",
        className
      )}
      {...props}
    />
  )
})
Field.displayName = "Field"

const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      data-slot="field-label"
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
})
FieldLabel.displayName = "FieldLabel"

const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      data-slot="field-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FieldDescription.displayName = "FieldDescription"

const FieldError = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    errors?: (RHFFieldError | undefined)[]
  }
>(({ className, errors, children, ...props }, ref) => {
  const errorMessage = errors?.[0]?.message

  if (!errorMessage && !children) return null

  return (
    <p
      ref={ref}
      data-slot="field-error"
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {errorMessage || children}
    </p>
  )
})
FieldError.displayName = "FieldError"

const FieldContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="field-content"
      className={cn("flex flex-1 flex-col gap-2", className)}
      {...props}
    />
  )
})
FieldContent.displayName = "FieldContent"

const FieldGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="field-group"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
})
FieldGroup.displayName = "FieldGroup"

const FieldSet = React.forwardRef<
  HTMLFieldSetElement,
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>
>(({ className, ...props }, ref) => {
  return (
    <fieldset
      ref={ref}
      data-slot="fieldset"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
})
FieldSet.displayName = "FieldSet"

const FieldLegend = React.forwardRef<
  HTMLLegendElement,
  React.HTMLAttributes<HTMLLegendElement> & {
    variant?: "label" | "default"
  }
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <legend
      ref={ref}
      data-slot="field-legend"
      className={cn(
        variant === "label" && "text-sm font-medium leading-none",
        variant === "default" && "text-base font-semibold",
        className
      )}
      {...props}
    />
  )
})
FieldLegend.displayName = "FieldLegend"

const FieldTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="field-title"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  )
})
FieldTitle.displayName = "FieldTitle"

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldTitle,
}
