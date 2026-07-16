/**
 * Kind words — elegant placeholders until real client
 * testimonials take their place.
 */

export interface Testimonial {
  quote: string;
  author: string;
  context: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: "It felt like they understood before we could explain. The film still makes us cry — in the best possible way.",
    author: "A family",
    context: "Memorial Film",
  },
  {
    quote: "The rare studio fluent in both languages: emotion and engineering.",
    author: "Founder",
    context: "Platform Client",
  },
  {
    quote: "Our product has never looked this alive. Frames you want to live inside.",
    author: "Brand Director",
    context: "Product Film",
  },
];
