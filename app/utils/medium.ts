import { XMLParser } from 'fast-xml-parser'

export interface MediumPost {
  title: string
  link: string
  pubDate: string
  thumbnail: string
}

// Create a cache for medium posts to avoid re-parsing on client-side navigations
let postsCache: { posts: MediumPost[], timestamp: number } | null = null;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

export async function getMediumPosts(): Promise<MediumPost[]> {
  // Return cached posts if they exist and are fresh
  if (postsCache && (Date.now() - postsCache.timestamp < CACHE_DURATION)) {
    return postsCache.posts;
  }
  
  try {
    const response = await fetch(
      'https://medium.com/feed/@joaoac',
      { next: { revalidate: 3600 } } // Revalidate every hour
    )
    
    const xml = await response.text()
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      // Only parse the elements we need to reduce processing
      isArray: (name) => name === 'item',
    })
    
    const feed = parser.parse(xml)
    const items = feed.rss.channel.item

    // Only process the first 3 items to reduce JavaScript execution
    const limitedItems = items.slice(0, 3);
    
    const posts = limitedItems.map((item: any) => {
      // Extract first image from content or use a default
      const imgMatch = item['content:encoded']?.match(/<img[^>]+src="([^">]+)"/)
      const thumbnail = imgMatch 
        ? imgMatch[1] 
        : 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg'

      return {
        title: item.title,
        link: item.link,
        pubDate: new Date(item.pubDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        thumbnail: thumbnail
      }
    });
    
    // Update cache
    postsCache = {
      posts,
      timestamp: Date.now()
    };
    
    return posts;
  } catch (error) {
    console.error('Error fetching Medium posts:', error)
    return []
  }
} 