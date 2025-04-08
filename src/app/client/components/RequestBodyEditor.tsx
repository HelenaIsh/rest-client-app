import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';

type ContentType = 'json' | 'text';

interface RequestBodyEditorProps {
  requestBody: string;
  setRequestBody: (content: string) => void;
}

const RequestBodyEditor: React.FC<RequestBodyEditorProps> = ({
  requestBody = '{}',
  setRequestBody,
}) => {
  const [content, setContent] = useState<string>(requestBody);
  const [contentType, setContentType] = useState<ContentType>('json');
  const [isValidJson, setIsValidJson] = useState<boolean>(true);

  useEffect(() => {
    if (contentType === 'json') {
      try {
        JSON.parse(content);
        setIsValidJson(true);
      } catch {
        setIsValidJson(false);
      }
    }
  }, [content, contentType]);

  const handleContentChange = (value: string) => {
    setContent(value);
    setRequestBody(value);
  };

  const prettifyContent = () => {
    if (contentType === 'json') {
      try {
        const parsed = JSON.parse(content);
        const prettified = JSON.stringify(parsed, null, 2);
        setContent(prettified);
        setRequestBody(prettified);
      } catch (e) {
        console.error('Invalid JSON cannot be prettified', e);
      }
    } else {
      const prettified = content
        .split('\n')
        .map((line) => line.trim())
        .join('\n');
      setContent(prettified);
      setRequestBody(prettified);
    }
  };

  const clearContent = () => {
    const defaultValue = contentType === 'json' ? '{}' : '';
    setContent(defaultValue);
    setRequestBody(defaultValue);
  };

  const extensions =
    contentType === 'json' ? [json()] : [EditorView.lineWrapping];

  return (
    <div className={'border border-gray-300 rounded-md overflow-hidden '}>
      <div className="flex justify-between items-center p-2">
        <div className="flex gap-4 ">
          <label className="flex items-center gap-1 cursor-pointer ">
            <input
              type="radio"
              className="text-blue-500"
              checked={contentType === 'json'}
              onChange={() => setContentType('json')}
            />
            JSON
          </label>
          <label className="flex items-center gap-1 cursor-pointer ">
            <input
              type="radio"
              className="text-blue-500"
              checked={contentType === 'text'}
              onChange={() => setContentType('text')}
            />
            Plain Text
          </label>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={prettifyContent}
            disabled={contentType === 'json' && !isValidJson}
            className="px-2 py-1  rounded border border-gray-300 hover:bg-gray-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Prettify
          </button>
          <button
            type="button"
            onClick={clearContent}
            className="px-2 py-1 bg-gray-700 text-gray-200 rounded border border-gray-300 hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
      </div>

      <div
        className={`${!isValidJson && contentType === 'json' ? 'border border-red-500' : ''}`}
      >
        <CodeMirror
          value={content}
          extensions={extensions}
          onChange={handleContentChange}
          height="250px"
          className="text-sm"
        />
      </div>

      {!isValidJson && contentType === 'json' && (
        <div className="p-2 text-red-400 border-t border-red-500">
          Invalid JSON format
        </div>
      )}
    </div>
  );
};

export default RequestBodyEditor;
