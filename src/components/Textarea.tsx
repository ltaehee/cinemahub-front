import { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = (props: TextareaProps) => {
  return <textarea {...props} />;
};

export default Textarea;
