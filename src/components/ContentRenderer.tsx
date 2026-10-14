// Renders markdown-like content strings from curriculum
export function ContentRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let codeBlock = false;
  let codeLines: string[] = [];

  const processInline = (text: string): React.ReactNode => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={idx} className="inline-code">{part.slice(1, -1)}</code>;
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      if (!codeBlock) {
        codeBlock = true;
        codeLines = [];
      } else {
        codeBlock = false;
        elements.push(
          <div key={i} className="code-block">
            <code style={{ whiteSpace: 'pre' }}>{codeLines.join('\n')}</code>
          </div>
        );
      }
      i++;
      continue;
    }
    if (codeBlock) { codeLines.push(line); i++; continue; }

    if (line.startsWith('## ')) {
      elements.push(<h2 key={i}>{processInline(line.slice(3))}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i}>{processInline(line.slice(4))}</h3>);
    } else if (line.startsWith('> ')) {
      elements.push(<blockquote key={i}>{processInline(line.slice(2))}</blockquote>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(<ul key={i} style={{ marginLeft: 20, marginBottom: 6 }}><li>{processInline(line.slice(2))}</li></ul>);
    } else if (/^\d+\.\s/.test(line)) {
      elements.push(<ol key={i} style={{ marginLeft: 20, marginBottom: 6 }}><li>{processInline(line.replace(/^\d+\.\s/, ''))}</li></ol>);
    } else if (line.startsWith('| ')) {
      // Table — collect all rows
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        if (!lines[i].match(/^\|[-|\s]+\|$/)) {
          rows.push(lines[i].split('|').filter(c => c.trim() !== '').map(c => c.trim()));
        }
        i++;
      }
      elements.push(
        <table key={`table-${i}`}>
          <thead><tr>{rows[0]?.map((c, ci) => <th key={ci}>{c}</th>)}</tr></thead>
          <tbody>{rows.slice(1).map((row, ri) => <tr key={ri}>{row.map((c, ci) => <td key={ci}>{processInline(c)}</td>)}</tr>)}</tbody>
        </table>
      );
      continue;
    } else if (line.trim() !== '') {
      elements.push(<p key={i}>{processInline(line)}</p>);
    }
    i++;
  }

  return <div className="topic-body">{elements}</div>;
}
