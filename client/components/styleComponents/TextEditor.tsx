import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TextEditor = ({
	height,
	state,
	setState,
	permission,
}: {
	height: number;
	state: string;
	setState: (state: string) => void;
	permission: boolean;
}) => {
	return (
		<Editor
			apiKey='k2mdbhdghjdndh7maplw6i0dpw4zaehwzmr32kjoubxndfkb'
			value={state}
			init={{
				height: height,
				menubar: false,
			}}
			onEditorChange={(content, editor) => {
				setState(content);
			}}
			disabled={!permission}
		/>
	);
};

export default TextEditor;
