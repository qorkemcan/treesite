import type { APIRoute } from 'astro';

export const prerender = true;

const allImagesGlob = import.meta.glob('../assets/gallery/fl/**/*.{jpeg,jpg,png,gif,webp}');

const getCategoryFromPath = (path: string) => {
  if (path.includes('/removal/')) return 'removal';
  if (path.includes('/stump/')) return 'stump';
  return 'emergency';
};

const getCategoryName = (category: string) => {
  if (category === 'removal') return 'Tree Removal';
  if (category === 'stump') return 'Stump Grinding';
  return 'Emergency Care';
};

export const GET: APIRoute = async () => {
  const imagePaths = Object.keys(allImagesGlob).sort();

  const payload: Record<string, Array<{
    src: string;
    width: number;
    height: number;
    alt: string;
  }>> = {
    removal: [],
    stump: [],
    emergency: [],
  };

  await Promise.all(
    imagePaths.map(async (path) => {
      const mod: any = await allImagesGlob[path]();
      const image = mod.default;
      const category = getCategoryFromPath(path);
      const categoryName = getCategoryName(category);

      payload[category].push({
        src: image.src,
        width: image.width ?? 500,
        height: image.height ?? 500,
        alt: `Florida ${categoryName} service project`,
      });
    }),
  );

  return new Response(JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};