// @flow

import React from 'react';
import MarkdownDocs from 'metadata-react/Markdown/MarkdownDocs';
import markdown from './About.md';

export default function Page() {
  return <MarkdownDocs markdown={markdown} subtitle="business-programming" />;
}
