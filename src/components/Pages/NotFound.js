// @flow

import React from 'react';
import MarkdownDocs from 'metadata-react/Markdown/MarkdownDocs';
import markdown from './NotFound.md';

export default function Page() {
  return <MarkdownDocs markdown={markdown} subtitle="Flowcon" />;
}
