import { pick } from 'lodash';
import { QuillConfig } from 'ngx-quill';

export function keepOnlyTextAndBasicFormatting(node, delta) {
    const ops: any[] = [];
    delta.ops.forEach(op => {
        if (op.insert && typeof op.insert === 'string') {
            ops.push({
                insert: op.insert,
                attributes: pick(op.attributes, ['bold', 'italic', 'strike', 'list', 'script', 'link']),
            });
        }
    });

    delta.ops = ops;
    return delta;
}

export const quillConfig: QuillConfig = {
    theme: 'bubble',
    placeholder: '',
    modules: {
        toolbar: [
            ['bold', 'italic', 'strike'],
            [{script: 'sub'}, {script: 'super'}],
            [{list: 'ordered'}, {list: 'bullet'}],
            ['link'],
            ['clean'], // remove formatting button
        ],
        clipboard: {
            matchVisual: false,
            matchers: [
                [
                    Node.ELEMENT_NODE,
                    keepOnlyTextAndBasicFormatting,
                ],
            ],
        },

    },
};
