interface MediumPost {
  title: string;
  date: string;
  preview: string;
  link: string;
  thumbnail: string;
}

interface Rss2JsonItem {
  title: string;
  pubDate: string;
  description: string;
  content?: string;
  link: string;
}

interface Rss2JsonResponse {
  items?: Rss2JsonItem[];
}

export async function getMediumPosts(locale: 'en' | 'pt-BR' = 'en'): Promise<MediumPost[]> {
  try {
    const response = await fetch(
      'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@joaoac',
      {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(2500),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Medium posts');
    }

    const data = (await response.json()) as Rss2JsonResponse;

    return (data.items ?? []).slice(0, 3).map((item) => {
      const content = item.content || item.description;
      const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
      const thumbnail = imgMatch ? imgMatch[1] : '';

      return {
        title: item.title,
        date: new Date(item.pubDate).toLocaleDateString(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        preview: `${item.description.replace(/<[^>]*>/g, '').substring(0, 150)}...`,
        link: item.link,
        thumbnail,
      };
    });
  } catch (error) {
    console.error('Error fetching Medium posts:', error);
    return [];
  }
}
