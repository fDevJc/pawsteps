# Supabase SQL Queries for Project PawSteps

This document contains all necessary SQL queries to set up the Supabase database for the Project PawSteps application, including table creation, RLS policies, and triggers.

---

## 1. `families` Table Creation

This table stores unique identifiers for each family group.

```sql
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT
);
```

---

## 2. Add `family_id` to `activities` Table

This query adds a `family_id` column to the `activities` table, linking activities to a specific family.

```sql
ALTER TABLE activities
ADD COLUMN family_id UUID REFERENCES public.families(id) ON DELETE CASCADE;
```

---

## 3. `profiles` Table Creation and RLS Policies

This table stores user-specific profile information, including their `family_id`. It also sets up RLS for the `profiles` table.

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  family_id UUID REFERENCES public.families(id) ON DELETE SET NULL, -- SET NULL if a family is deleted
  -- Add other profile fields here as needed
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile."
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

---

## 4. Trigger to Create Profile for New Users

This function and trigger automatically create a `profiles` entry for every new user who signs up via Supabase Auth.

```sql
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

---

## 5. `activities` Table RLS Policies

These policies enable Row Level Security for the `activities` table and restrict access based on the user's `family_id`.

```sql
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT operations
CREATE POLICY "Users can view activities of their family."
  ON activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.family_id = activities.family_id
    )
  );

-- Policy for INSERT operations
CREATE POLICY "Users can create activities for their family."
  ON activities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.family_id = activities.family_id
    )
  );

-- Policy for UPDATE operations
CREATE POLICY "Users can update activities of their family."
  ON activities FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.family_id = activities.family_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.family_id = activities.family_id
    )
  );

-- Policy for DELETE operations
CREATE POLICY "Users can delete activities of their family."
  ON activities FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.family_id = activities.family_id
    )
  );
```
