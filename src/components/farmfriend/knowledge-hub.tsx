"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/language-context';
import { MessageSquare, PlusCircle } from 'lucide-react';

const forumQuestions = [
  { id: 1, textKey: 'q1', replies: 5 },
  { id: 2, textKey: 'q2', replies: 8 },
  { id: 3, textKey: 'q3', replies: 2 },
];

export function KnowledgeHub() {
  const { t } = useLanguage();

  return (
    <section id="knowledge-hub" className="w-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
          {t.knowledgeHubTitle}
        </h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
          {t.knowledgeHubDescription}
        </p>
      </div>

      <div className="max-w-2xl mx-auto mt-8 space-y-6">
        <div className="text-center">
          <Button size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            {t.askQuestion}
          </Button>
        </div>

        <div className="space-y-4">
          {forumQuestions.map((q) => (
            <Card key={q.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-4 flex items-center justify-between">
                <p className="font-medium">{t.qs[q.textKey as keyof typeof t.qs]}</p>
                <div className="flex items-center gap-2 text-muted-foreground text-sm flex-shrink-0 ml-4">
                  <MessageSquare className="h-4 w-4" />
                  <span>{q.replies} {t.replies}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
