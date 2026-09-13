"use client";

import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function NotesField({ value, onChange }: Props) {
  return (
    <Card className="shadow-md border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-slate-700">Additional Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Payment terms, bank details, thank you message..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
        />
      </CardContent>
    </Card>
  );
}
