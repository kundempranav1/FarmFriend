'use server';

import htmlToDocx from 'html-to-docx';

export async function generateDocx(htmlString: string): Promise<string> {
  const fileBuffer = await htmlToDocx(htmlString, undefined, {
    table: { row: { cantSplit: true } },
    footer: true,
    pageNumber: true,
  });

  return (fileBuffer as Buffer).toString('base64');
}
