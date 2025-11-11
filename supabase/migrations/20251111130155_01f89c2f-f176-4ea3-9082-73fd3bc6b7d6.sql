-- Create saved_fact_checks table
CREATE TABLE public.saved_fact_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  claim TEXT NOT NULL,
  verdict TEXT NOT NULL,
  confidence_level INTEGER NOT NULL CHECK (confidence_level >= 0 AND confidence_level <= 100),
  full_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_fact_checks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own saved fact-checks" 
ON public.saved_fact_checks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved fact-checks" 
ON public.saved_fact_checks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved fact-checks" 
ON public.saved_fact_checks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_saved_fact_checks_updated_at
BEFORE UPDATE ON public.saved_fact_checks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_saved_fact_checks_user_id ON public.saved_fact_checks(user_id);
CREATE INDEX idx_saved_fact_checks_created_at ON public.saved_fact_checks(created_at DESC);