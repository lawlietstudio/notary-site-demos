import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { dataset, projectId } from './project';
import { schemaTypes } from './schemaTypes';
import { singletonIds, structure } from './structure';

export default defineConfig({
  name: 'default',
  title: 'Notary website',
  projectId,
  dataset,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    // Each page is a single document: hide "create new" for them.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonIds.has(schemaType)),
  },
  document: {
    // ...and don't allow deleting, unpublishing or duplicating them.
    actions: (prev, { schemaType }) =>
      singletonIds.has(schemaType)
        ? prev.filter(({ action }) => action && !['unpublish', 'delete', 'duplicate'].includes(action))
        : prev,
  },
});
