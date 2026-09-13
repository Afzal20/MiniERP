-- Migration: stripe_subscriptions

-- Add Stripe fields to organizations
ALTER TABLE public.organizations
ADD COLUMN stripe_customer_id text,
ADD COLUMN stripe_subscription_id text;

-- Create subscriptions table
CREATE TABLE public.subscriptions (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    stripe_subscription_id text NOT NULL UNIQUE,
    stripe_customer_id text NOT NULL,
    status text NOT NULL,
    price_id text,
    quantity integer,
    cancel_at_period_end boolean,
    cancel_at timestamp with time zone,
    canceled_at timestamp with time zone,
    current_period_start timestamp with time zone,
    current_period_end timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    CONSTRAINT subscriptions_org_unique UNIQUE(organization_id)
);

-- RLS for subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their organization's subscription"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (
    organization_id IN (
        SELECT organization_id FROM public.team_members
        WHERE user_id = auth.uid()
    )
);

-- Note: we don't grant insert/update/delete to authenticated users
-- because the Stripe webhook server will handle these using service_role key.
