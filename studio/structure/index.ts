import type {StructureResolver} from 'sanity/structure'

const singletonTypes = ['siteSettings']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Website content')
    .items([
      S.listItem()
        .title('Site settings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Site settings')),
      S.divider(),
      ...S.documentTypeListItems().filter((listItem) => !singletonTypes.includes(listItem.getId() as string)),
    ])
