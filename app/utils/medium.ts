import { XMLParser } from 'fast-xml-parser'

export interface MediumPost {
  title: string
  link: string
  pubDate: string
  content: string
  thumbnail: string
}

export async function getMediumPosts(): Promise<MediumPost[]> {
  try {
    const response = await fetch(
      'https://medium.com/feed/@joaoac',
      { next: { revalidate: 3600 } } // Revalidate every hour
    )
    
    const xml = await response.text()
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    })
    
    const feed = parser.parse(xml)
    const items = feed.rss.channel.item

    return items.map((item: any) => {
      // Extract first image from content or use a default
      const imgMatch = item['content:encoded'].match(/<img[^>]+src="([^">]+)"/)
      const thumbnail = imgMatch 
        ? imgMatch[1] 
        : 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg'

      // Extract description (first paragraph)
      const description = item['content:encoded']
        .replace(/<[^>]+>/g, '') // Remove HTML tags
        .split('\n')[0] // Get first paragraph
        .slice(0, 200) + '...' // Limit length

      return {
        title: item.title,
        link: item.link,
        pubDate: new Date(item.pubDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        content: description,
        thumbnail: thumbnail
      }
    }).slice(0, 3) // Get only the 3 most recent posts
  } catch (error) {
    console.error('Error fetching Medium posts:', error)
    return []
  }
} 