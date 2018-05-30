// @flow

import React from 'react';
import MarkdownDocs from 'metadata-react/Markdown/MarkdownDocs';
import markdown from './About.md';
import {description} from '../App/menu';

export default function Page() {
  return <MarkdownDocs markdown={markdown} subtitle="business-programming" descr={description} canonical="/about"/>;
}
