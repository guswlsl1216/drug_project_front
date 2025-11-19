import TableCell from '@tiptap/extension-table-cell';

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        renderHTML: attrs => {
          if (!attrs.backgroundColor) return {};
          return { style: `background-color: ${attrs.backgroundColor}` };
        },
        parseHTML: element => ({
          backgroundColor: element.style.backgroundColor || null,
        }),
      },
    };
  },
});

export default CustomTableCell;
