import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product/product-card";
import { VariantPicker } from "@/components/product/variant-picker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getProductByHandle,
  getRelatedProducts,
  isShopifyConfigured,
} from "@/lib/shopify";

type Params = Promise<{ handle: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  if (!isShopifyConfigured()) return { title: "Product" };
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return { title: "Product not found" };

  const image = product.featuredImage ?? product.images.nodes[0] ?? null;
  return {
    title: product.seo.title ?? product.title,
    description:
      product.seo.description ??
      `${product.title} — limited wearable art by ARTCHY.`,
    openGraph: {
      title: product.seo.title ?? product.title,
      description:
        product.seo.description ??
        `${product.title} — limited wearable art by ARTCHY.`,
      images: image
        ? [
            {
              url: image.url,
              width: image.width ?? undefined,
              height: image.height ?? undefined,
              alt: image.altText ?? product.title,
            },
          ]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  if (!isShopifyConfigured()) notFound();

  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const [heroImage, ...detailImages] = product.images.nodes;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 lg:grid-cols-2">
          {/* Galerij: één groot beeld boven, daaronder de detailfoto's */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[4/5] overflow-hidden border border-line bg-night">
              {heroImage ? (
                <Image
                  src={heroImage.url}
                  alt={heroImage.altText ?? product.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-ash">
                  Image coming soon
                </div>
              )}
            </div>
            {detailImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {detailImages.slice(0, 4).map((image) => (
                  <div
                    key={image.url}
                    className="relative aspect-square overflow-hidden border border-line bg-night"
                  >
                    <Image
                      src={image.url}
                      alt={image.altText ?? product.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.vendor && (
              <p className="label text-gold">{product.vendor}</p>
            )}
            <h1 className="mt-2 text-heading text-snow">{product.title}</h1>

            <VariantPicker product={product} />

            {product.descriptionHtml && (
              <div
                className="prose-invert mt-10 max-w-prose text-sm leading-relaxed text-ash [&_a]:text-gold [&_p]:mt-3"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            )}

            <div className="mt-10 border-t border-line pt-6 text-sm text-ash">
              <h2 className="label text-snow">Shipping</h2>
              <p className="mt-2" data-placeholder="true">
                Limited editions ship within 5–7 business days. Free shipping
                above €100.
              </p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mx-auto w-full max-w-6xl px-6 pb-24">
            <h2 className="text-subheading text-snow">You may also like</h2>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
