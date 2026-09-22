import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineArrayMember, defineField, defineType} from 'sanity'

const imageWithAlt = defineArrayMember({
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
})

const richText = defineArrayMember({
  type: 'block',
  styles: [{title: 'Normal', value: 'normal'}],
  lists: [],
  marks: {
    decorators: [
      {title: 'Strong', value: 'strong'},
      {title: 'Emphasis', value: 'em'},
    ],
    annotations: [],
  },
})

const imageGallery = defineField({
  name: 'gallery',
  title: 'Photo gallery',
  type: 'array',
  group: 'hero',
  of: [imageWithAlt],
})

const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({name: 'siteName', title: 'Site name', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'email', title: 'Contact email', type: 'string', validation: (rule) => rule.email()}),
    defineField({name: 'phone', title: 'Phone number', type: 'string'}),
    defineField({name: 'whatsAppNumber', title: 'WhatsApp number', type: 'string'}),
  ],
})

const safariTrip = defineType({
  name: 'safariTrip',
  title: 'Safari trip',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'basic', title: 'Basic details', default: true},
    {name: 'hero', title: 'Hero & pricing'},
    {name: 'overview', title: 'Overview'},
    {name: 'experience', title: 'Highlights & wildlife'},
    {name: 'itinerary', title: 'Itinerary'},
    {name: 'inclusions', title: 'Inclusions'},
    {name: 'related', title: 'Related trips'},
    {name: 'seo', title: 'SEO'},
    {name: 'migration', title: 'Migration metadata'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Trip title',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      group: 'basic',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Trip summary',
      type: 'text',
      group: 'basic',
      rows: 4,
      validation: (rule) => rule.max(220).warning('Keep this concise for trip cards and search results.'),
    }),
    defineField({
      name: 'categories',
      title: 'Trip categories',
      type: 'array',
      group: 'basic',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'featured',
      title: 'Feature this trip',
      type: 'boolean',
      group: 'basic',
      initialValue: false,
    }),

    defineField({
      name: 'guideLabel',
      title: 'Guide label',
      description: 'Small label above the trip title.',
      type: 'string',
      group: 'hero',
      initialValue: 'Golden Trips · Tanzania Safari Guide',
    }),
    imageGallery,
    defineField({
      name: 'promotionLabel',
      title: 'Promotion label',
      description: 'Optional badge displayed over the main trip photo.',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'reviewRating',
      title: 'Review rating',
      type: 'number',
      group: 'hero',
      validation: (rule) => rule.min(0).max(5).precision(1),
    }),
    defineField({
      name: 'reviewCount',
      title: 'Review count',
      type: 'number',
      group: 'hero',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'reviewSource',
      title: 'Review source label',
      description: 'For example, “Golden Trips”.',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'tourStart',
      title: 'Tour start',
      description: 'For example, “On any date”.',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'durationDays',
      title: 'Duration (days)',
      type: 'number',
      group: 'hero',
      validation: (rule) => rule.integer().min(1),
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      group: 'hero',
      options: {
        list: [
          {title: 'Easy level', value: 'Easy level'},
          {title: 'Moderate level', value: 'Moderate level'},
          {title: 'Challenging level', value: 'Challenging level'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'startingPrice',
      title: 'Starting price (USD)',
      type: 'number',
      group: 'hero',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'pricingTiers',
      title: 'Price tiers',
      description: 'Per-person prices by group size, when supplied by the source tour.',
      type: 'array',
      group: 'hero',
      of: [
        defineArrayMember({
          type: 'object',
          icon: DocumentTextIcon,
          fields: [
            defineField({name: 'groupSize', title: 'Group size', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'pricePerPerson', title: 'Price per person (USD)', type: 'number', validation: (rule) => rule.required().min(0)}),
          ],
          preview: {
            select: {title: 'groupSize', subtitle: 'pricePerPerson'},
            prepare({title, subtitle}) {
              return {title, subtitle: typeof subtitle === 'number' ? `$${subtitle.toLocaleString('en-US')} per person` : undefined}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'priceNote',
      title: 'Price note',
      description: 'Text below the quote button.',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'quoteButtonLabel',
      title: 'Quote button label',
      type: 'string',
      group: 'hero',
      initialValue: 'Request quote',
    }),

    defineField({
      name: 'overview',
      title: 'Tour overview',
      type: 'array',
      group: 'overview',
      of: [richText],
    }),
    defineField({
      name: 'overviewHighlights',
      title: 'Overview highlights',
      type: 'array',
      group: 'overview',
      of: [
        defineArrayMember({
          type: 'object',
          icon: DocumentTextIcon,
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3, validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
      validation: (rule) => rule.max(4),
    }),

    defineField({
      name: 'highlightsHeading',
      title: 'Highlights heading',
      description: 'Heading above the trip highlight cards.',
      type: 'string',
      group: 'experience',
    }),
    defineField({
      name: 'highlights',
      title: 'Trip highlights',
      type: 'array',
      group: 'experience',
      of: [
        defineArrayMember({
          type: 'object',
          icon: DocumentTextIcon,
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3, validation: (rule) => rule.required()}),
            defineField({name: 'icon', title: 'Icon', type: 'image', options: {hotspot: true}}),
          ],
          preview: {select: {title: 'title', subtitle: 'description', media: 'icon'}},
        }),
      ],
    }),
    defineField({
      name: 'wildlifeHeading',
      title: 'Wildlife heading',
      type: 'string',
      group: 'experience',
      initialValue: 'Wildlife you may encounter',
    }),
    defineField({
      name: 'wildlife',
      title: 'Wildlife',
      type: 'array',
      group: 'experience',
      of: [
        defineArrayMember({
          type: 'object',
          icon: DocumentTextIcon,
          fields: [
            defineField({
              name: 'animal',
              title: 'Tanzanian safari animal',
              type: 'string',
              options: {
                list: [
                  {title: 'Elephant', value: 'elephant'},
                  {title: 'Giraffe', value: 'giraffe'},
                  {title: 'Lion', value: 'lion'},
                  {title: 'Leopard', value: 'leopard'},
                  {title: 'Cheetah', value: 'cheetah'},
                  {title: 'Crocodile', value: 'crocodile'},
                  {title: 'Baboon', value: 'baboon'},
                  {title: 'Antelope', value: 'antelope'},
                  {title: 'Hyena', value: 'hyena'},
                  {title: 'Ostrich', value: 'ostrich'},
                  {title: 'Wildebeest', value: 'wildebeest'},
                  {title: 'Zebra', value: 'zebra'},
                  {title: 'Hippopotamus', value: 'hippopotamus'},
                  {title: 'African buffalo', value: 'african-buffalo'},
                  {title: 'Rhinoceros', value: 'rhinoceros'},
                  {title: 'Warthog', value: 'warthog'},
                  {title: 'African wild dog', value: 'african-wild-dog'},
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'availability',
              title: 'Availability',
              type: 'string',
              options: {list: ['Abundant', 'Common', 'Rare'], layout: 'radio'},
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: 'animal', subtitle: 'availability'}},
        }),
      ],
      validation: (rule) => rule.max(12),
    }),

    defineField({
      name: 'itineraryHeading',
      title: 'Itinerary heading',
      type: 'string',
      group: 'itinerary',
      initialValue: 'Family itinerary day by day',
    }),
    defineField({
      name: 'itinerary',
      title: 'Day-by-day itinerary',
      type: 'array',
      group: 'itinerary',
      of: [
        defineArrayMember({
          type: 'object',
          icon: DocumentTextIcon,
          fields: [
            defineField({name: 'dayRange', title: 'Day range', description: 'For example, “Day 1–2”.', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'title', title: 'Location title', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'region', title: 'Region or area', type: 'string'}),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'array',
              of: [richText],
              validation: (rule) => rule.min(1).error('Add the day description.'),
            }),
            defineField({
              name: 'images',
              title: 'Photos',
              type: 'array',
              of: [imageWithAlt],
            }),
            defineField({name: 'meals', title: 'Meals', description: 'Only include meals stated for this day.', type: 'string'}),
            defineField({
              name: 'accommodation',
              title: 'Accommodation',
              type: 'object',
              fields: [
                defineField({name: 'name', title: 'Accommodation name', type: 'string'}),
                defineField({name: 'gallery', title: 'Accommodation gallery', type: 'array', of: [imageWithAlt]}),
              ],
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'dayRange', media: 'images.0'}},
        }),
      ],
      validation: (rule) => rule.min(1).error('Add at least one itinerary stop.'),
    }),
    defineField({
      name: 'itineraryMap',
      title: 'Itinerary map',
      type: 'image',
      group: 'itinerary',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string', validation: (rule) => rule.required()})],
    }),
    defineField({
      name: 'itineraryMapLabel',
      title: 'Map duration label',
      description: 'For example, “8 days”.',
      type: 'string',
      group: 'itinerary',
    }),
    defineField({
      name: 'itineraryButtonLabel',
      title: 'Itinerary button label',
      type: 'string',
      group: 'itinerary',
      initialValue: 'Plan your family trip',
    }),

    defineField({
      name: 'featuredInclusion',
      title: 'Featured inclusion',
      type: 'object',
      group: 'inclusions',
      fields: [
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'array', of: [richText]}),
        defineField({
          name: 'details',
          title: 'Feature details',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              icon: DocumentTextIcon,
              fields: [
                defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'description', title: 'Description', type: 'array', of: [richText], validation: (rule) => rule.min(1)}),
              ],
              preview: {select: {title: 'title'}},
            }),
          ],
        }),
        defineField({name: 'gallery', title: 'Feature gallery', type: 'array', of: [imageWithAlt]}),
      ],
    }),
    defineField({
      name: 'inclusions',
      title: 'Included services',
      type: 'array',
      group: 'inclusions',
      of: [
        defineArrayMember({
          type: 'object',
          icon: DocumentTextIcon,
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'array',
              of: [richText],
            }),
            defineField({name: 'icon', title: 'Icon', type: 'image', options: {hotspot: true}}),
          ],
          preview: {select: {title: 'title', media: 'icon'}},
        }),
      ],
    }),
    defineField({
      name: 'exclusions',
      title: 'Excluded services',
      type: 'array',
      group: 'inclusions',
      of: [
        defineArrayMember({
          type: 'object',
          icon: DocumentTextIcon,
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'description', title: 'Description', type: 'array', of: [richText]}),
          ],
          preview: {select: {title: 'title'}},
        }),
      ],
    }),

    defineField({
      name: 'relatedTrips',
      title: 'Related trips',
      type: 'array',
      group: 'related',
      of: [defineArrayMember({type: 'reference', to: [{type: 'safariTrip'}]})],
      validation: (rule) => rule.unique().max(3),
    }),

    defineField({
      name: 'seo',
      title: 'Search and sharing',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({name: 'title', title: 'SEO title', type: 'string', validation: (rule) => rule.max(60).warning('Aim for 60 characters or fewer.')}),
        defineField({name: 'description', title: 'SEO description', type: 'text', rows: 3, validation: (rule) => rule.max(160).warning('Aim for 160 characters or fewer.')}),
        defineField({name: 'shareImage', title: 'Social share image', type: 'image', options: {hotspot: true}}),
      ],
    }),
    defineField({
      name: 'legacy',
      title: 'Legacy source',
      description: 'Original WordPress identity retained for repeatable imports and future redirects.',
      type: 'object',
      group: 'migration',
      fields: [
        defineField({name: 'source', title: 'Source system', type: 'string', readOnly: true}),
        defineField({name: 'sourceId', title: 'WordPress post ID', type: 'string', readOnly: true}),
        defineField({name: 'url', title: 'Original URL', type: 'url', validation: (rule) => rule.uri({scheme: ['http', 'https']}), readOnly: true}),
        defineField({name: 'migratedAt', title: 'Last migrated at', type: 'datetime', readOnly: true}),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'durationDays', media: 'gallery.0'},
    prepare({title, subtitle, media}) {
      return {title, subtitle: subtitle ? `${subtitle} days` : 'Safari trip', media}
    },
  },
})

export const schemaTypes = [siteSettings, safariTrip]
