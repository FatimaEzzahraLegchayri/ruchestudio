import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import post from '@/schemas/post'


export default defineConfig({
  name: 'default',
  title: 'Admin Dashboard',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '', 
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  basePath: '/blog', 

  plugins: [structureTool()],

  schema: {
    types: [post], 
  },
})