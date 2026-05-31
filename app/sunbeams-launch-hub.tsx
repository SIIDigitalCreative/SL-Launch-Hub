"use client";
import { useState, useRef } from "react";

// ── Brand UI tokens (Sunbeams Lifestyle app chrome only) ──────────────────────
const B = {
  primary:"#CB0033", brown:"#A47860", beige:"#D6D2C4", cloud:"#F4F0EC",
  // Light mode surfaces
  bg:"#FAF7F4",        // warm off-white page bg
  surface:"#FFFFFF",  // card/panel bg
  surfaceAlt:"#F4F0EC", // Cloud Dancer — section bg
  border:"#E8DDD5",   // warm light border
  borderStrong:"#D6C8BC", // stronger border
  // Text
  text:"#2A1A10",     // near-black warm
  textMid:"#6B4A38",  // medium brown text
  muted:"#A08070",    // muted warm grey
  dimText:"#C4B0A0",  // very muted
};

const CATEGORIES = ["Skincare","Wellness","Home & Living","Lifestyle Accessories","Apparel","Food & Beverage","Fragrance","Hair Care","Other"];
const PLATFORMS  = ["Lazada","Shopee","TikTok Shop","Shopify","Instagram","Facebook"];

const EMPTY_PRODUCT = () => ({
  id: Date.now() + Math.random(),
  productName:"", category:"Skincare", size:"", color:"",
  shape:"", dimensions:"", inclusions:"", warranty:"", warrantyDuration:"",
  pricePoint:"", specialOffer:"",
});

// ── Demo presets for auto-fill ────────────────────────────────────────────────
const DEMO_PRESETS = [
  {
    label: "Quencha Drinkware Collection",
    brandInfo: {
      brandName: "Sunbeams Lifestyle — Quencha",
      collectionName: "Quencha Hydration",
      launchDate: new Date(Date.now() + 28*24*60*60*1000).toISOString().split("T")[0],
      platforms: ["Lazada","Shopee","TikTok Shop","Shopify","Instagram","Facebook"],
      brandColors: "#CB0033 (Pantone 1935 C), #A47860, #D6D2C4, #F4F0EC (Cloud Dancer)",
      brandTypeface: "Playfair Display, DM Sans",
      packagingDimensions: "Retail box: 22cm × 10cm × 10cm per unit",
      logoUrl: "",
    },
    products: [
      { id:1, productName:"Quencha 19oz & 37oz Insulated Tumbler", category:"Home & Living", size:"550ml / 1100ml", color:"Multiple colorways — Matte Black, Sage, Sand", shape:"Slim insulated tumbler with strap and silicone boot", dimensions:"23cm × 8cm (550ml)", inclusions:"Tumbler, silicone boot, carry strap, leak-proof lid", warranty:"Manufacturer warranty", warrantyDuration:"1 year", pricePoint:"₱799.75", specialOffer:"Bundle 2 for ₱1,499" },
      { id:2, productName:"Quencha 17oz & 37oz Flip Cap Water Bottle", category:"Home & Living", size:"500ml / 1100ml", color:"Clear with coloured flip cap — multiple variants", shape:"Slim plastic bottle with flip-top cap", dimensions:"24cm × 7cm (500ml)", inclusions:"Bottle with flip cap lid", warranty:"Manufacturer warranty", warrantyDuration:"6 months", pricePoint:"₱149.75", specialOffer:"3 for ₱399 launch promo" },
      { id:3, productName:"Quencha 12oz & 17oz Glass Water Bottle", category:"Home & Living", size:"350ml / 500ml", color:"Clear borosilicate glass with silicone sleeve — multiple colours", shape:"Cylindrical glass bottle with silicone protective sleeve", dimensions:"22cm × 6.5cm (500ml)", inclusions:"Glass bottle, silicone sleeve, leak-proof cap", warranty:"Manufacturer warranty", warrantyDuration:"6 months", pricePoint:"₱299.75", specialOffer:"Free silicone sleeve colour upgrade on launch week" },
    ],
  },
  {
    label: "Crysalis Bar & Glassware",
    brandInfo: {
      brandName: "Sunbeams Lifestyle — Crysalis",
      collectionName: "Crysalis Bar Essentials",
      launchDate: new Date(Date.now() + 28*24*60*60*1000).toISOString().split("T")[0],
      platforms: ["Shopify","Lazada","Shopee","TikTok Shop","Instagram"],
      brandColors: "#CB0033 (Pantone 1935 C), #A47860, #D6D2C4, #F4F0EC (Cloud Dancer)",
      brandTypeface: "Playfair Display",
      packagingDimensions: "Gift-ready box per unit; set box: 30cm × 22cm × 14cm",
      logoUrl: "",
    },
    products: [
      { id:4, productName:"Crysalis 750ml Double Wall Cocktail Shaker", category:"Home & Living", size:"750ml", color:"Stainless steel with double-wall vacuum insulation", shape:"Classic cocktail shaker — tapered cylinder with strainer lid", dimensions:"23cm × 9cm diameter", inclusions:"Cocktail shaker, built-in strainer, twist-lock lid", warranty:"Manufacturer warranty", warrantyDuration:"1 year", pricePoint:"₱529.75", specialOffer:"Free cocktail recipe card set on launch" },
      { id:5, productName:"Crysalis 1000ml Glass Teapot", category:"Home & Living", size:"1000ml", color:"Clear borosilicate glass with stainless steel infuser", shape:"Ergonomic teapot with curved spout and heat-resistant handle", dimensions:"18cm × 14cm × 13cm", inclusions:"Glass teapot, removable stainless steel infuser, silicone lid seal", warranty:"Manufacturer warranty", warrantyDuration:"1 year", pricePoint:"₱599.75", specialOffer:"Bundle with Crysalis Double Wall Mugs: ₱999 (save ₱200)" },
      { id:6, productName:"Crysalis 1600ml Double Wall Wine Chiller Bucket", category:"Home & Living", size:"1600ml", color:"Brushed stainless steel, double-wall vacuum", shape:"Cylindrical wine/champagne chiller bucket", dimensions:"22cm height × 14cm diameter", inclusions:"Wine chiller bucket, removable inner liner, carry handle", warranty:"Manufacturer warranty", warrantyDuration:"1 year", pricePoint:"₱899.75", specialOffer:"Complimentary gift wrapping on launch week" },
    ],
  },
  {
    label: "Primeo Home Textiles",
    brandInfo: {
      brandName: "Sunbeams Lifestyle — Primeo",
      collectionName: "Primeo Home Essentials",
      launchDate: new Date(Date.now() + 21*24*60*60*1000).toISOString().split("T")[0],
      platforms: ["Shopify","Instagram","Lazada","Shopee","TikTok Shop"],
      brandColors: "#CB0033 (Pantone 1935 C), #A47860, #D6D2C4, #F4F0EC (Cloud Dancer)",
      brandTypeface: "Playfair Display, DM Sans",
      packagingDimensions: "Kraft sleeve wrap per item; set box: 35cm × 25cm × 8cm",
      logoUrl: "",
    },
    products: [
      { id:7, productName:"Primeo 100% Cotton Popcorn Weave Beach Towel", category:"Home & Living", size:"70cm × 140cm", color:"Multiple colourways — Ecru, Sage, Dusty Rose, Stone", shape:"Oversized flat-weave towel with popcorn texture", dimensions:"70cm × 140cm folded to 25cm × 14cm", inclusions:"Beach towel, kraft tie wrap", warranty:"Quality guarantee", warrantyDuration:"6 months", pricePoint:"₱699.75", specialOffer:"Buy 2 get 1 free on launch week" },
      { id:8, productName:"Primeo Bathroom Accessory Set", category:"Home & Living", size:"4-piece set", color:"Matte White / Matte Black / Sand — matching set", shape:"Rectangular dispensers and holders — minimal profile", dimensions:"Soap dispenser: 8cm × 6cm × 18cm", inclusions:"Soap dispenser, toothbrush holder, tumbler, soap dish", warranty:"Quality guarantee", warrantyDuration:"6 months", pricePoint:"₱899.75", specialOffer:"Free bath mat with full set purchase" },
    ],
  },
];

// ── Infer benefit / audience per category ─────────────────────────────────────
function inferProduct(p, brandInfo) {
  const catBenefits = {
    "Skincare":["visibly improves skin texture and radiance","delivers deep hydration and nourishment","supports a healthier, glowing complexion"],
    "Wellness":["supports daily health and wellbeing routines","promotes balance and vitality","designed for the health-conscious lifestyle"],
    "Home & Living":["elevates everyday living spaces","combines form and function beautifully","adds warmth and character to any home"],
    "Lifestyle Accessories":["complements a refined, modern lifestyle","crafted for those who appreciate quality details","the perfect finishing touch for your daily ritual"],
    "Apparel":["designed for effortless style and comfort","versatile enough for every occasion","tailored to move with you through your day"],
    "Food & Beverage":["crafted for discerning taste and quality","made with premium ingredients for everyday indulgence","nourishes the body and delights the senses"],
    "Fragrance":["evokes emotion and memory with every wear","a signature scent that becomes part of your identity","long-lasting and beautifully balanced"],
    "Hair Care":["nourishes and strengthens from root to tip","restores shine and vitality to every strand","a salon-quality ritual for your everyday routine"],
    "Other":["crafted with quality and intention","designed to complement your lifestyle","a premium addition to your daily routine"],
  };
  const catAudiences = {
    "Skincare":["women aged 25–45 who prioritise clean beauty and self-care","skin-conscious individuals seeking effective, premium skincare"],
    "Wellness":["health-conscious adults who invest in their wellbeing","individuals pursuing a balanced, intentional lifestyle"],
    "Home & Living":["homeowners with a refined eye for interior aesthetics","lifestyle enthusiasts who treat their home as a sanctuary"],
    "Lifestyle Accessories":["modern professionals and lifestyle-driven individuals","those who believe every detail of their daily ritual matters"],
    "Apparel":["style-conscious individuals who value quality over quantity","urban professionals seeking versatile, elevated wardrobe pieces"],
    "Food & Beverage":["food lovers and quality-seekers who value premium ingredients","health-conscious consumers who don't compromise on taste"],
    "Fragrance":["fragrance enthusiasts who seek a signature, memorable scent","individuals who express identity through scent"],
    "Hair Care":["individuals seeking a premium, results-driven hair care ritual","those who invest in salon-quality care at home"],
    "Other":["lifestyle-oriented consumers who appreciate premium quality","individuals who invest in products that reflect their values"],
  };
  const b = catBenefits[p.category]||catBenefits["Other"];
  const a = catAudiences[p.category]||catAudiences["Other"];
  const keyBenefit    = b[Math.floor(Math.random()*b.length)];
  const targetCustomer= a[Math.floor(Math.random()*a.length)];
  const details = [
    p.size        ? `comes in ${p.size}`                        : "",
    p.color       ? `available in ${p.color}`                   : "",
    p.shape       ? `features a ${p.shape} design`              : "",
    p.dimensions  ? `measuring ${p.dimensions}`                 : "",
    p.inclusions  ? `includes ${p.inclusions}`                  : "",
    p.warranty    ? `backed by a ${p.warrantyDuration||""} ${p.warranty}`.trim() : "",
  ].filter(Boolean);
  return { keyBenefit, targetCustomer, details };

}

// ── Image prompt builder ───────────────────────────────────────────────────────
function buildImagePrompt(type, product, brandInfo, inf) {
  const brand = brandInfo.brandName || "Sunbeams Lifestyle";
  const colorNote = brandInfo.brandColors
    ? `Brand color palette for backgrounds/props: ${brandInfo.brandColors}.`
    : "Use a warm, elevated color palette with neutral tones and soft contrasts.";
  const typefaceNote = brandInfo.brandTypeface
    ? `Brand typeface for any text overlays: ${brandInfo.brandTypeface}.`
    : "";
  const shapeNote = product.shape ? `The product has a ${product.shape} form.` : "";
  const colorProd = product.color ? `Product color/finish: ${product.color}.` : "";

  // Product-only base — no brand theme applied to the product itself
  const productBase = `Premium product photography. Product: ${product.productName}, category: ${product.category}. ${shapeNote} ${colorProd} ${inf.keyBenefit}. Photorealistic, editorial quality, high-end commercial photography style.`;

  // Platform/social base — brand theme applied to environment, backgrounds, props only (never to the product)
  const platformBase = `${productBase} ${colorNote} ${typefaceNote} Brand: ${brand}.`;

  const prompts = {
    mockup: `${productBase} Clean hero product shot on a minimal neutral surface with soft natural shadows. Product centered, beautifully lit, no text or overlays, no branding applied to the product. Pure product beauty shot suitable for e-commerce.`,
    social_feed: `${platformBase} Lifestyle flat lay or styled scene for Instagram feed. Product surrounded by complementary lifestyle props that suggest ${inf.targetCustomer.split(" ").slice(0,4).join(" ")}. Brand palette applied to props and background only — product appearance unchanged. Warm, aspirational mood. Square composition.`,
    social_story: `${platformBase} Vertical 9:16 lifestyle image for Instagram/TikTok stories. Product held or in use in a natural setting. Brand palette in background and styling only. Bright, warm, inviting atmosphere. Space at top for text overlay.`,
    lazada: `${platformBase} E-commerce hero banner 1:1 square format. Product on clean white or very light background. Professional lighting. Brand colours used in background accents only. Suitable for Lazada/Shopee marketplace listing main image.`,
    shopee: `${platformBase} Lifestyle product banner. Product featured prominently with soft background gradient using brand palette. Clean, vibrant, marketplace-ready. Brand theme in environment only. Horizontal composition.`,
    tiktok: `${platformBase} Vertical product reveal thumbnail. Dramatic lighting with the product as the clear hero. Eye-catching enough to stop a scroll. Dark or gradient background with product glowing. Brand palette in background only.`,
  };
  return prompts[type] || prompts.mockup;
}

// ── Claude API call for image generation ──────────────────────────────────────
async function generateImage(prompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens:1000,
      messages:[{
        role:"user",
        content:`You are an image generation prompt optimizer. Take this prompt and return ONLY a refined, detailed image generation prompt (no explanation, no preamble, just the prompt text):\n\n${prompt}`
      }]
    })
  });
  const data = await response.json();
  // Return the refined prompt text to display since we can't generate actual images
  const text = data.content?.map(b=>b.text||"").join("") || prompt;
  return text;
}

// ── Launch plan generator (local) ─────────────────────────────────────────────
function generateLaunchPlan(brandInfo, products) {
  const brand      = brandInfo.brandName      || "Sunbeams Lifestyle";
  const collection = brandInfo.collectionName || "";
  const platforms  = brandInfo.platforms;
  const launchDate = brandInfo.launchDate;

  const inferred = {};
  products.forEach(p => { inferred[p.id] = inferProduct(p, brandInfo); });

  // First product drives the top-level theme
  const mainInf = inferred[products[0].id];
  const theme = collection
    ? `${collection} — ${mainInf.keyBenefit.split(" ").slice(0,4).join(" ")}`
    : `${products[0].productName} — ${mainInf.keyBenefit.split(" ").slice(0,4).join(" ")}`;

  const productList = products.map(p=>`${p.productName} (${p.category})`).join(", ");
  const collectionStr = collection ? ` ${collection} Collection` : "";

  // ── BRIEFS ────────────────────────────────────────────────────────────────
  const briefs = {
    packaging:{
      objective:`Deliver launch-ready packaging for the${collectionStr} range: ${productList}. Each product has its own packaging spec — see per-product details below.`,
      deliverables: [
        `Primary packaging per SKU — confirm specs with Creative Director before production`,
        `Secondary packaging (box/sleeve/bag) with campaign theme: "${theme}"`,
        ...products.map(p=>{
          const parts=[
            p.size       ? `Size: ${p.size}`        : "",
            p.shape      ? `Shape: ${p.shape}`       : "",
            p.dimensions ? `Dims: ${p.dimensions}`   : "",
            p.inclusions ? `Includes: ${p.inclusions}`: "",
            p.warranty   ? `Warranty: ${p.warrantyDuration||""} ${p.warranty}`.trim() : "",
          ].filter(Boolean).join(" · ");
          return `${p.productName}: ${parts||"spec TBC with team"}`;
        }),
        `Photography-ready samples (min. 6 units per SKU) for creative shoot`,
        `All packing materials, cards, and inserts QC-checked before dispatch`,
      ],
      guidelines:[
        brandInfo.brandColors
          ? `Brand colors confirmed per product brief: ${brandInfo.brandColors}. Apply consistently.`
          : `Brand colors to be confirmed per product — do not apply until Creative Director approves`,
        brandInfo.brandTypeface
          ? `Brand typeface: ${brandInfo.brandTypeface} — use for all on-pack typography`
          : `Brand typeface TBC — await Creative Director sign-off before printing`,
        `Packaging dimensions must match confirmed specs before production run begins`,
        `Use recyclable or FSC-certified materials wherever possible`,
      ],
      deadline:`Week 1 — samples ready Day 5; final production units Day 18`,
      notes:`Each product in the collection may have different packaging specs. Confirm individually with Creative Director before briefing vendor.`,
    },
    creative:{
      objective:`Produce all digital and visual assets for the${collectionStr} launch (${productList}) across all channels (${platforms.join(", ")}). Campaign: "${theme}".`,
      deliverables:[
        `Hero campaign images per product (min. 8 selects each) — product on white, lifestyle, detail shots`,
        `Collection hero shot — all ${products.length} product${products.length>1?"s":""} together in one styled scene`,
        `Video: 15s & 30s launch video, TikTok hook per product (3s problem/5s reveal/15s demo/5s CTA)`,
        `Static ad creatives per platform per product — Lazada, Shopee, Meta, TikTok`,
        `Shopify: collection landing page banner + individual PDPs`,
        `Retail POS materials — A4 in-store signage (for Sales/B2B partners to print), shelf talker, A3 standee, wobbler per product`,
        `B2B asset pack per product for Sales team: product video (MP4), hero image (hi-res JPG), A4 signage (print-ready PDF)`,
      ],
      guidelines:[
        brandInfo.brandColors
          ? `Use brand colors: ${brandInfo.brandColors}`
          : `Brand colors TBC per product — await confirmed palette before production`,
        `One primary message per asset, one CTA — no visual clutter`,
        `Review all assets in platform context before sign-off`,
        `Deliver in platform-specific specs — no resizing without quality check`,
      ],
      deadline:`Week 2 — shoot Day 8–9; first drafts Day 12; final assets Day 18`,
      notes:`Multi-product collection requires individual and group shots. Allocate extra studio time.`,
    },
    ecommerce:{
      objective:`Set up and optimise all ${products.length} product listing${products.length>1?"s":""} from the${collectionStr} range across all platforms simultaneously. Day 1 top-page visibility.`,
      deliverables: [
        ...products.map(p=>`${p.productName}: Lazada, Shopee, TikTok Shop & Shopify listings — copy, images, pricing, stock`),
        `Collection landing page on Shopify featuring all ${products.length} SKU${products.length>1?"s":""}`,
        `TikTok Shop: product showcase, affiliate commission at 15% per product`,
        `Klaviyo abandoned cart flows: 1hr, 24hr, 72hr per product`,
        `Cross-platform pricing parity confirmed across all SKUs`,
      ],
      guidelines:[
        `Title: Brand + Product Name + Key Feature + Variant — max 120 characters`,
        `All listings go LIVE simultaneously at 9:00 AM on launch day`,
        `Vouchers and shipping subsidies active on all platforms at launch`,
        `Confirm FBL/stock allocation per SKU 1 week before launch`,
      ],
      deadline:`Week 2 — drafts Day 10; assets loaded Day 16; QA Day 20; live Day 25`,
      notes:`${products.length} SKU${products.length>1?"s need individual":"needs"} QA. Allow extra time for multi-product listings check.`,
    },
    marketing:{
      objective:`Drive consumer awareness, digital acquisition, and online sales for the${collectionStr} range (${productList}) across all digital channels and platforms. Campaign: "${theme}".`,
      deliverables:[
        `Paid media plan: Meta (Feed, Stories, Reels), TikTok Ads (VSA, TopView), Google (Search + Shopping) — budgeted per product`,
        `Influencer/KOL campaign: 3–5 micro-influencers (10K–100K) briefed on full${collectionStr} collection`,
        `Email campaign: teaser (D-7), launch day, post-launch follow-up (D+3) via Klaviyo`,
        `PR outreach: press release and media kit sent to lifestyle, beauty, and home media`,
        `Organic social content calendar: teaser posts, launch day content, post-launch UGC amplification`,
      ],
      guidelines:[
        `All messaging anchored to campaign theme: "${theme}" — consistent across every channel`,
        `UTM parameters on every digital link before publishing — no exceptions`,
        `A/B test one element per ad set — headline, image, or audience — not all at once`,
        `Daily launch week report: impressions, CTR, CVR, ROAS, GMV per platform — to PM by 6PM`,
      ],
      deadline:`Week 1 — media plan approved Day 3; influencer briefs sent Day 5; email sequences built Day 7`,
      notes:`Multi-product collection — ensure each SKU has dedicated creative assets in the paid media plan. Coordinate with Digital Creative for all asset deliveries.`,
    },
    sales:{
      objective:`Notify, brief, and equip all B2B wholesale clients, distributors, and retail trade partners (hotels, restaurants, cafés, independent retailers) on the${collectionStr} launch. Drive wholesale orders and ensure in-store visibility.`,
      deliverables:[
        `B2B launch announcement email — product overview, pricing, MOQ, and order process for all ${products.length} SKU${products.length>1?"s":""}`,
        `Viber group announcement to all active B2B partners — teaser message (D-7) and launch day "Now Live" blast`,
        `Wholesale product deck: collection overview, product specs, imagery, pricing tiers, and ordering details`,
        `A4 in-store signage (received from Digital Creative team) — printed and distributed to all retail partners`,
        `Product video and hero images (received from Digital Creative team) — sent to all B2B partners for in-store and digital use`,
      ],
      guidelines:[
        `Coordinate with Digital Creative by Week 1 — request: product video, hero images, and A4 signage files`,
        `All B2B comms (email + Viber) go out simultaneously — no partner receives information before others`,
        `Wholesale pricing and MOQ details must be confirmed with management before any B2B communication`,
        `A4 signage files must be reviewed and approved before sending to print or distributing to partners`,
      ],
      deadline:`Week 1 — B2B deck ready Day 3; creative assets requested from Creative team Day 3; first Viber teaser Day 7`,
      notes:`Sales team is the direct point of contact for all B2B wholesale, distributor, hotel, restaurant, and café partners. All trade communications go through Sales. Digital Creative team supplies assets — Sales team distributes them.`,
    },
  };

  // ── TASKS ─────────────────────────────────────────────────────────────────
  const tasks = {
    packaging:[
      {week:1,task:`Kick-off with Creative Director — confirm packaging specs per SKU: ${productList}`,owner:"Packaging Lead",priority:"high",done:false},
      {week:1,task:`Brief packaging vendor with individual specs, quantities, and delivery timeline per product`,owner:"Packaging Lead",priority:"high",done:false},
      {week:1,task:`Order raw materials and packaging components for all ${products.length} SKU${products.length>1?"s":""}`,owner:"Packaging Lead",priority:"high",done:false},
      {week:2,task:`Produce photography-ready samples (min. 6 units per SKU) for creative shoot`,owner:"Packaging Lead",priority:"high",done:false},
      {week:2,task:`Quality check per product: print accuracy, structural integrity, color match`,owner:"Packaging Lead",priority:"high",done:false},
      {week:2,task:`Deliver approved samples to Creative team for shoot`,owner:"Packaging Lead",priority:"medium",done:false},
      {week:3,task:`Sign off on print proofs for all SKUs — approve final production runs`,owner:"Packaging Lead",priority:"high",done:false},
      {week:3,task:`Coordinate retail-ready units with logistics for shelf deployment`,owner:"Packaging Lead",priority:"medium",done:false},
      {week:4,task:`Confirm all units (all SKUs) delivered to warehouse and retail, ready for launch`,owner:"Packaging Lead",priority:"high",done:false},
    ],
    creative:[
      {week:1,task:`Creative brief + mood board + shot list for full${collectionStr} collection`,owner:"Creative Director",priority:"high",done:false},
      {week:1,task:`Book photographer, videographer, and studio — allocate extra time for ${products.length} SKU${products.length>1?"s":""}`,owner:"Creative Director",priority:"high",done:false},
      {week:1,task:`Prepare shoot props and styling for all products in the collection`,owner:"Creative Team",priority:"medium",done:false},
      {week:2,task:`Full collection shoot — individual hero shots + group collection shot`,owner:"Creative Director",priority:"high",done:false},
      {week:2,task:`TikTok hook video per product (3s/5s/15s/5s formula)`,owner:"Creative Team",priority:"high",done:false},
      {week:2,task:`First draft: hero images, platform banners, and ad creatives per product`,owner:"Creative Team",priority:"high",done:false},
      {week:3,task:`Internal review — check all assets per product in platform context`,owner:"Creative Director",priority:"high",done:false},
      {week:3,task:`Final asset delivery to E-Commerce team for all listings`,owner:"Creative Team",priority:"high",done:false},
      {week:3,task:`Retail POS materials — shelf talker, standee, wobbler per product`,owner:"Creative Team",priority:"medium",done:false},
      {week:3,task:`Prepare B2B asset pack per product for Sales team: product video (MP4), hero images (hi-res), A4 signage (print-ready PDF)`,owner:"Creative Team",priority:"high",done:false},
      {week:3,task:`Hand off B2B asset pack to Sales team — confirm receipt and print readiness of A4 signage`,owner:"Creative Director",priority:"high",done:false},
      {week:4,task:`Final QA on all live assets across all platforms and devices`,owner:"Creative Director",priority:"high",done:false},
    ],
    ecommerce:[
      {week:1,task:`Create draft listings for all ${products.length} SKU${products.length>1?"s":""} on all platforms`,owner:"E-Commerce Manager",priority:"high",done:false},
      {week:1,task:`Configure TikTok Shop affiliate (15%) and product showcase for each SKU`,owner:"E-Commerce Manager",priority:"high",done:false},
      {week:2,task:`Upload final copy and assets to all listings per product`,owner:"E-Commerce Team",priority:"high",done:false},
      {week:2,task:`Set up Klaviyo abandoned cart: 1hr, 24hr, 72hr for each product`,owner:"E-Commerce Manager",priority:"high",done:false},
      {week:2,task:`Configure platform vouchers and shipping subsidies per SKU`,owner:"E-Commerce Team",priority:"medium",done:false},
      {week:3,task:`Full QA per SKU: images, copy, pricing, stock on all platforms`,owner:"E-Commerce Manager",priority:"high",done:false},
      {week:3,task:`Inventory allocation per channel per SKU (30-day velocity forecast)`,owner:"E-Commerce Manager",priority:"high",done:false},
      {week:3,task:`Build Shopify collection page featuring all ${products.length} product${products.length>1?"s":""}`,owner:"E-Commerce Team",priority:"high",done:false},
      {week:4,task:`Set all SKUs to go live at 9:00 AM on launch day`,owner:"E-Commerce Manager",priority:"high",done:false},
      {week:4,task:`Monitor GMV, CVR, and stock per SKU hourly on launch day`,owner:"E-Commerce Team",priority:"high",done:false},
    ],
    marketing:[
      {week:1,task:`Finalise paid media plan: budget per product per channel (Meta, TikTok Ads, Google Search & Shopping)`,owner:"Marketing Manager",priority:"high",done:false},
      {week:1,task:`Brief 3–5 micro-influencers (10K–100K) — send${collectionStr} collection overview and product samples`,owner:"Marketing Manager",priority:"high",done:false},
      {week:2,task:`Teaser content — collection reveal posts D-7 and D-5 on Instagram, TikTok, and Facebook`,owner:"Marketing Manager",priority:"medium",done:false},
      {week:2,task:`Build all paid media campaigns in draft — creatives and audiences set per product`,owner:"Marketing Manager",priority:"high",done:false},
      {week:2,task:`Ship influencer seeding packages with full collection brief and brand guidelines`,owner:"Marketing Manager",priority:"high",done:false},
      {week:3,task:`Email campaigns in Klaviyo: teaser (D-7), launch day, post-launch follow-up (D+3)`,owner:"Marketing Manager",priority:"high",done:false},
      {week:3,task:`Press release and media kit for${collectionStr} collection — distribute to lifestyle, beauty, and home media`,owner:"Marketing Manager",priority:"medium",done:false},
      {week:4,task:`Activate all paid media campaigns at 8:00 AM on launch day`,owner:"Marketing Manager",priority:"high",done:false},
      {week:4,task:`Monitor and report daily: impressions, CTR, CVR, ROAS, GMV — report to PM by 6PM each day`,owner:"Marketing Manager",priority:"high",done:false},
    ],
    sales:[
      {week:1,task:`Prepare B2B launch announcement: product/collection overview deck for wholesale clients and distribution partners`,owner:"Sales Manager",priority:"high",done:false},
      {week:1,task:`Compile B2B client list: wholesalers, distributors, hotels, restaurants, and café partners`,owner:"Sales Manager",priority:"high",done:false},
      {week:1,task:`Coordinate with Digital Creative team — request product video, hero images, and A4 signage files for physical stores`,owner:"Sales Manager",priority:"high",done:false},
      {week:2,task:`Send Viber group announcement to all B2B partners: product/collection teaser with launch date`,owner:"Sales Manager",priority:"high",done:false},
      {week:2,task:`Send email blast to wholesale and distributor list — include product deck, pricing, and MOQ details`,owner:"Sales Manager",priority:"high",done:false},
      {week:2,task:`Confirm A4 signage files received from Creative team — review and approve for printing`,owner:"Sales Manager",priority:"high",done:false},
      {week:3,task:`Follow-up call/Viber message to key B2B accounts — confirm orders and stock requirements`,owner:"Sales Manager",priority:"high",done:false},
      {week:3,task:`Distribute printed A4 signage and product assets (video, images) to retail partners for in-store display`,owner:"Sales Team",priority:"high",done:false},
      {week:3,task:`Confirm product delivery schedule with logistics for all B2B wholesale orders`,owner:"Sales Manager",priority:"medium",done:false},
      {week:4,task:`Launch day Viber blast to all B2B partners — "Now Live" announcement with buy links and reorder info`,owner:"Sales Manager",priority:"high",done:false},
      {week:4,task:`Launch day email to all B2B clients — full collection is live, include platform links, pricing, and contact for orders`,owner:"Sales Manager",priority:"high",done:false},
      {week:4,task:`Post-launch B2B check-in: gather sell-through feedback from retail partners; flag reorder needs to logistics`,owner:"Sales Team",priority:"medium",done:false},
    ],
  };

  // ── COPY (first product as primary, rest appended) ─────────────────────────
  const mainP = products[0];
  const mainInfData = inferred[mainP.id];
  const platformKeyMap = {"Lazada":"lazada","Shopee":"shopee","TikTok Shop":"tiktok","Shopify":"shopify","Instagram":"instagram","Facebook":"facebook"};

  const allCopy = {};
  platforms.forEach(p => {
    const k = platformKeyMap[p];
    if(!k) return;
    allCopy[k] = buildCopyForPlatform(k, products, inferred, brand, collection, theme, brandInfo);
  });

  // ── CALENDAR ──────────────────────────────────────────────────────────────
  const calendar = {
    week1:{ theme:"Foundation — Strategy, Briefing & Kick-Off", days:[
      {day:"Day 1", team:"All Teams",  action:`Launch kick-off — share collection brief, "${theme}", timelines for all ${products.length} SKU${products.length>1?"s":""}`, type:"planning"},
      {day:"Day 2", team:"Creative",  action:`Brief packaging vendor per SKU; confirm specs, quantities, delivery dates`,type:"production"},
      {day:"Day 3", team:"Marketing",  action:`Finalise paid media plan; brief 3–5 micro-influencers on full${collectionStr} collection`,type:"planning"},
      {day:"Day 3", team:"Sales", action:`Prepare B2B launch deck; request product video, images & A4 signage from Creative team`,type:"planning"},
      {day:"Day 4", team:"Digital Creative",   action:`Collection creative brief, mood board, and shot list; book studio`,type:"planning"},
      {day:"Day 5", team:"E-Commerce", action:`Create draft listings for all ${products.length} SKU${products.length>1?"s":""} on all platforms`,type:"setup"},
      {day:"Day 7", team:"All Teams",  action:`Week 1 check-in — vendors briefed, budgets approved, timelines locked`,type:"review"},
    ]},
    week2:{ theme:"Production — Shoot, Assets & Listing Build", days:[
      {day:"Day 8", team:"Creative",  action:`Photography-ready samples (all SKUs) delivered to Creative team`,type:"production"},
      {day:"Day 9", team:"Digital Creative",   action:`Collection shoot — individual hero shots + group shot for all ${products.length} products`,type:"production"},
      {day:"Day 10",team:"Marketing",  action:`Teaser content live — collection reveal D-14; influencer packages shipped`,type:"production"},
      {day:"Day 10",team:"Sales", action:`Send Viber teaser blast + email to all B2B partners — launch date and product preview`,type:"production"},
      {day:"Day 11",team:"E-Commerce", action:`Upload final copy and assets to all listings; TikTok affiliate configured`,type:"setup"},
      {day:"Day 12",team:"Digital Creative",   action:`First draft assets — all platform banners and ad creatives per product`,type:"review"},
      {day:"Day 14",team:"All Teams",  action:`Week 2 review — assets, listings, influencer confirmation`,type:"review"},
    ]},
    week3:{ theme:"Finalisation — QA, Load & Retail Deployment", days:[
      {day:"Day 15",team:"Digital Creative",   action:`Final asset delivery to E-Commerce; retail POS sent to print`,type:"production"},
      {day:"Day 16",team:"E-Commerce", action:`Full QA per SKU on all platforms: images, copy, pricing, stock`,type:"review"},
      {day:"Day 17",team:"Marketing",  action:`All paid campaigns in draft; Klaviyo email sequences live`,type:"setup"},
      {day:"Day 18",team:"Creative",  action:`All production units to warehouse; inventory allocated per channel`,type:"production"},
      {day:"Day 19",team:"Sales", action:`Distribute A4 signage + product assets to retail partners; confirm wholesale orders`,type:"setup"},
      {day:"Day 20",team:"Sales", action:`Follow-up Viber message to key accounts — confirm receipt of assets and stock readiness`,type:"review"},
      {day:"Day 21",team:"All Teams",  action:`Pre-launch war room — all platforms ready, campaigns loaded, stock confirmed`,type:"review"},
    ]},
    week4:{ theme:"Launch Week — Go Live, Monitor & Optimise", days:[
      {day:"Day 22",team:"E-Commerce", action:`All SKUs scheduled to publish at 9:00 AM; vouchers and boosts queued`,type:"setup"},
      {day:"Day 23",team:"Marketing",  action:`Paid campaigns set to activate 8:00 AM; influencer launch-day posts confirmed`,type:"launch"},
      {day:"Day 23",team:"Sales", action:`Schedule launch day Viber blast + email — "Now Live" with buy links and reorder info`,type:"launch"},
      {day:"Day 24",team:"All Teams",  action:`Final pre-launch briefing — roles, KPIs, and escalation path confirmed`,type:"review"},
      {day:"Day 25",team:"All Teams",  action:`🚀 LAUNCH DAY — All ${products.length} SKU${products.length>1?"s":""} go live simultaneously at 9:00 AM. Monitor hourly.`,type:"launch"},
      {day:"Day 26",team:"E-Commerce", action:`Day 1 review — reallocate spend to top-performing SKUs and platforms`,type:"monitor"},
      {day:"Day 27",team:"Sales", action:`Post-launch B2B check-in — gather sell-through from retail partners; flag reorders`,type:"monitor"},
      {day:"Day 28",team:"All Teams",  action:`Week 1 post-launch report — GMV per SKU, ROAS, sell-through, B2B order volume, learnings`,type:"monitor"},
    ]},
  };

  return { briefs, tasks, calendar, copy: allCopy, inferred };
}

function buildCopyForPlatform(platform, products, inferred, brand, collection, theme, brandInfo) {
  const col = collection ? ` ${collection} Collection` : "";
  const p1 = products[0];
  const inf1 = inferred[p1.id];

  const productLines = products.map(p => {
    const inf = inferred[p.id];
    const specs = [p.size,p.color,p.inclusions].filter(Boolean).join(", ");
    return `• ${p.productName}${specs?" ("+specs+")":""} — ${inf.keyBenefit}`;
  }).join("\n");

  if(platform==="lazada") return {
    collectionTitle: `${brand}${col} | ${products.length>1?products.length+" Products":"Premium "+p1.category}`,
    products: products.map(p=>({
      name: p.productName,
      title:`${brand} ${p.productName}${p.color?" — "+p.color:""} | ${inferred[p.id].keyBenefit.split(" ").slice(0,4).join(" ")}`,
      bullets:[
        `✦ ${inferred[p.id].keyBenefit}`,
        p.size       ?`✦ Size: ${p.size}`        :null,
        p.color      ?`✦ Colour: ${p.color}`     :null,
        p.inclusions ?`✦ Includes: ${p.inclusions}`:null,
        p.warranty   ?`✦ Warranty: ${p.warrantyDuration||""} ${p.warranty}`.trim():null,
        `✦ Official ${brand} Store`,
      ].filter(Boolean),
      keywords:[p.productName, brand, p.category, inferred[p.id].keyBenefit.split(" ").slice(0,3).join(" "), collection].filter(Boolean),
    })),
  };

  if(platform==="shopee") return {
    collectionTitle:`[${brand}]${col} — ${products.length>1?"Full Collection":"New Launch"}`,
    products: products.map(p=>({
      name: p.productName,
      title:`[${brand}] ${p.productName}${p.color?" | "+p.color:""} | ${p.category}`,
      bullets:[
        `🌟 ${inferred[p.id].keyBenefit}`,
        p.size       ?`📏 Size: ${p.size}`        :null,
        p.color      ?`🎨 Colour: ${p.color}`     :null,
        p.inclusions ?`📦 Includes: ${p.inclusions}`:null,
        p.warranty   ?`🛡️ ${p.warrantyDuration||""} ${p.warranty}`.trim():null,
        `⭐ Official ${brand} Shopee Store`,
      ].filter(Boolean),
    })),
  };

  if(platform==="tiktok") return {
    collectionHook:`POV: You discovered the ${collection||brand} collection and your ${p1.category.toLowerCase()} routine changed forever 👀`,
    liveOpeningScript:`"Welcome to ${brand} LIVE! Today we're launching${col} — ${products.length} new product${products.length>1?"s":""} you've been waiting for!\n${productLines}\n\nWe have an exclusive launch offer active right now. Tap the pin below before it's gone!"`,
    products: products.map(p=>({
      name: p.productName,
      videoHook:`POV: You finally found the ${p.category.toLowerCase()} that ${inferred[p.id].keyBenefit.split(" ").slice(0,5).join(" ")}… 👀`,
      caption:`${theme} ✨\n${p.productName} — ${inferred[p.id].keyBenefit}\n${p.size?"Size: "+p.size+" · ":""}${p.color?p.color:""}\n\nShop via TikTok Shop 🛍️`,
      hashtags:[`#${p.productName.replace(/\s+/g,"")}`,`#${brand.replace(/\s+/g,"")}`,`#${p.category.replace(/\s+/g,"")}`,`#NewLaunch`,`#TikTokShop`,collection?`#${collection.replace(/\s+/g,"")}`:null].filter(Boolean),
    })),
  };

  if(platform==="shopify") return {
    collectionPage:{
      heroHeadline: theme,
      subheadline:`${products.length} Product${products.length>1?"s":""} · ${collection||brand}`,
      collectionDescription:`Introducing${col} from ${brand}. A curated range designed for ${inf1.targetCustomer}. ${productLines}`,
    },
    products: products.map(p=>({
      name: p.productName,
      heroHeadline: `${p.productName} — ${inferred[p.id].keyBenefit.split(" ").slice(0,5).join(" ")}`,
      description: `${p.productName}${col} from ${brand}.\n\n${inferred[p.id].keyBenefit}.\n\nDesigned for ${inferred[p.id].targetCustomer}.\n${[p.size&&"Size: "+p.size,p.color&&"Colour: "+p.color,p.inclusions&&"Includes: "+p.inclusions,p.warranty&&`Warranty: ${p.warrantyDuration||""} ${p.warranty}`.trim()].filter(Boolean).join(" · ")}`,
      metaTitle:`${p.productName} | ${p.category} | ${brand}`,
    })),
  };

  if(platform==="instagram") return {
    collectionRevealCaption:`Introducing${col}. ✨\n\n${theme}.\n\n${products.length} new product${products.length>1?"s":""} crafted for ${inf1.targetCustomer}.\n\n${productLines}\n\n#${brand.replace(/\s+/g,"")} ${collection?"#"+collection.replace(/\s+/g,"")+" ":""}#NewLaunch #LifestyleBrand`,
    products: products.map(p=>({
      name: p.productName,
      feedCaption:`${p.productName}. ✨\n\n${inferred[p.id].keyBenefit}.\n\nPart of${col}.\n\n#${brand.replace(/\s+/g,"")} #${p.productName.replace(/\s+/g,"")} #NewLaunch #${p.category.replace(/\s+/g,"")}`,
      storyText:`NEW ✦ ${p.productName}\n${inferred[p.id].keyBenefit}\nSwipe up to shop 🛍️`,
    })),
  };

  if(platform==="facebook") return {
    collectionAd:{
      headline:`Introducing${col} by ${brand}`,
      body:`${products.length} new product${products.length>1?"s":""} crafted for ${inf1.targetCustomer}.\n\n${productLines}\n\nShop the full collection now.`,
      cta:"Shop Now",
    },
    products: products.map(p=>({
      name: p.productName,
      headline:`${p.productName} — ${inferred[p.id].keyBenefit.split(" ").slice(0,5).join(" ")}`,
      body:`${inferred[p.id].keyBenefit}. Made for ${inferred[p.id].targetCustomer}. ${[p.size,p.color,p.inclusions].filter(Boolean).join(" · ")}`,
      cta:"Shop Now",
    })),
  };

  return {};
}

// ── UI ────────────────────────────────────────────────────────────────────────
const TypeColor={planning:"#A47860",production:"#CB0033",setup:"#D6D2C4",review:"#C4B0A0",launch:"#CB0033",monitor:"#A47860"};
const TEAMS=[
  {id:"packaging",label:"Creative",       icon:"⬡",color:B.brown},
  {id:"creative", label:"Digital Creative",icon:"✦",color:B.primary},
  {id:"ecommerce",label:"E-Commerce",      icon:"◆",color:B.beige},
  {id:"marketing",label:"Marketing",       icon:"▲",color:B.primary},
  {id:"sales",    label:"Sales",             icon:"◈",color:"#A47860"},
];

export default function LaunchHub(){
  const [step,setStep]           = useState("form");
  const [activeResult,setAR]     = useState("tasks");
  const [results,setResults]     = useState({});
  const [selTeam,setSelTeam]     = useState("packaging");
  const [selPlat,setSelPlat]     = useState("lazada");
  const [selWeek,setSelWeek]     = useState("week1");
  const [selProd,setSelProd]     = useState(0);
  const [taskState,setTaskState] = useState({});
  const [errors,setErrors]       = useState({});
  const [imgTab,setImgTab]       = useState("mockup");
  const [imgPrompts,setImgPrompts]= useState({});
  const [imgLoading,setImgLoading]= useState(false);
  const [showPresets,setShowPresets] = useState(false);

  const [brandInfo,setBrandInfo] = useState({
    brandName:"Sunbeams Lifestyle", collectionName:"",
    launchDate:"", platforms:["Lazada","Shopee","TikTok Shop","Shopify"],
    brandColors:"", brandTypeface:"", packagingDimensions:"", logoUrl:"",
  });

  const [products,setProducts] = useState([EMPTY_PRODUCT()]);

  const applyPreset = (preset) => {
    setBrandInfo(preset.brandInfo);
    setProducts(preset.products.map((p,i)=>({...p, id: Date.now()+i})));
    setShowPresets(false);
  };

  const setBrand = (k,v) => setBrandInfo(b=>({...b,[k]:v}));
  const togglePlat = p => setBrandInfo(b=>({...b,platforms:b.platforms.includes(p)?b.platforms.filter(x=>x!==p):[...b.platforms,p]}));

  const setProduct = (id,k,v) => setProducts(ps=>ps.map(p=>p.id===id?{...p,[k]:v}:p));
  const addProduct = () => setProducts(ps=>[...ps, EMPTY_PRODUCT()]);
  const removeProduct = id => setProducts(ps=>ps.filter(p=>p.id!==id));

  const validate=()=>{
    const e={};
    if(!brandInfo.brandName.trim()) e.brandName="Required";
    if(!brandInfo.launchDate)       e.launchDate="Required";
    if(products.some(p=>!p.productName.trim())) e.products="Each product needs a name";
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const generate=()=>{
    if(!validate()) return;
    setStep("loading");
    setTimeout(()=>{
      const plan = generateLaunchPlan(brandInfo, products);
      setResults(plan);
      const ts={};
      Object.entries(plan.tasks).forEach(([team,items])=>{
        items.forEach((_,i)=>{ts[`${team}-${i}`]=false;});
      });
      setTaskState(ts);
      const firstPlatKey=Object.keys(plan.copy)[0];
      if(firstPlatKey) setSelPlat(firstPlatKey);
      setStep("results");
      setAR("tasks");
    },1600);
  };

  const toggleTask=key=>setTaskState(s=>({...s,[key]:!s[key]}));
  const reset=()=>{setStep("form");setResults({});setErrors({});setTaskState({});setImgPrompts({});setProducts([EMPTY_PRODUCT()]);setShowPresets(false);};

  const taskProg=team=>{
    const items=results.tasks?.[team]||[];
    const done=items.filter((_,i)=>taskState[`${team}-${i}`]).length;
    return{done,total:items.length,pct:items.length?Math.round(done/items.length*100):0};
  };
  const allProg=()=>{
    const teams=Object.keys(results.tasks||{});
    const total=teams.reduce((a,t)=>a+(results.tasks[t]?.length||0),0);
    const done=teams.reduce((a,t)=>a+(results.tasks[t]?.filter((_,i)=>taskState[`${t}-${i}`]).length||0),0);
    return total?Math.round(done/total*100):0;
  };

  const IMG_TYPES=[
    {id:"mockup",      label:"Product Mockup"},
    {id:"social_feed", label:"Feed Post"},
    {id:"social_story",label:"Story / Reel"},
    {id:"lazada",      label:"Lazada Banner"},
    {id:"shopee",      label:"Shopee Banner"},
    {id:"tiktok",      label:"TikTok Thumb"},
  ];

  const genImagePrompt=async()=>{
    const product = products[selProd]||products[0];
    const inf = results.inferred?.[product.id]||{keyBenefit:"premium lifestyle product",targetCustomer:"lifestyle consumers"};
    const rawPrompt = buildImagePrompt(imgTab, product, brandInfo, inf);
    const key = `${product.id}-${imgTab}`;
    setImgLoading(true);
    try {
      const refined = await generateImage(rawPrompt);
      setImgPrompts(p=>({...p,[key]:refined}));
    } catch(e) {
      setImgPrompts(p=>({...p,[key]:rawPrompt}));
    }
    setImgLoading(false);
  };

  const css=`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:#FAF7F4;color:#2A1A10;font-family:'DM Sans',sans-serif;}
    .app{min-height:100vh;background:#FAF7F4;}
    input[type=date]::-webkit-calendar-picker-indicator{filter:none;opacity:0.5;}

    /* ── TOPBAR ── */
    .topbar{
      padding:0 40px;border-bottom:1px solid #E8DDD5;
      display:flex;justify-content:space-between;align-items:stretch;
      background:#FFFFFF;position:sticky;top:0;z-index:100;
      box-shadow:0 1px 12px rgba(42,26,16,0.06);
    }
    .topbar-brand{display:flex;align-items:center;gap:0;border-right:1px solid #E8DDD5;padding-right:28px;margin-right:28px;}
    .topbar-accent{width:4px;height:36px;background:#CB0033;margin-right:14px;border-radius:2px;}
    .brand{font-family:'Playfair Display',serif;font-size:17px;color:#2A1A10;letter-spacing:0.02em;}
    .brand-sub{font-size:8px;letter-spacing:0.28em;color:#A08070;margin-top:2px;text-transform:uppercase;}
    .topbar-mid{display:flex;align-items:center;gap:6px;flex:1;}
    .topbar-tag{font-size:8px;letter-spacing:0.18em;color:#A08070;text-transform:uppercase;padding:4px 10px;border:1px solid #E8DDD5;background:#FAF7F4;border-radius:2px;}
    .topbar-right{display:flex;align-items:center;}

    /* ── FORM PAGE ── */
    .fw{max-width:720px;margin:0 auto;padding:48px 32px 80px;}
    .form-hero{margin-bottom:40px;}
    .form-eyebrow{font-size:9px;letter-spacing:0.3em;color:#CB0033;text-transform:uppercase;margin-bottom:10px;}
    .form-title{font-family:'Playfair Display',serif;font-size:36px;font-weight:400;color:#2A1A10;line-height:1.15;}
    .form-title em{color:#CB0033;font-style:italic;}
    .form-desc{font-size:12px;color:#A08070;margin-top:8px;letter-spacing:0.02em;}

    /* ── AUTOFILL BAR ── */
    .autofill-bar{
      display:flex;align-items:center;justify-content:space-between;
      margin-bottom:36px;padding:16px 20px;
      background:linear-gradient(135deg,#FFF5F7 0%,#FFF0EB 100%);
      border:1px solid #F2D0D8;border-left:3px solid #CB0033;
    }
    .autofill-label{font-size:11px;color:#6B4A38;}
    .autofill-label span{font-family:'Playfair Display',serif;font-size:14px;color:#2A1A10;font-style:italic;display:block;margin-top:2px;}
    .autofill-btn{
      padding:10px 20px;background:#CB0033;color:#FFFFFF;border:none;
      font-family:'DM Sans',sans-serif;font-size:10px;font-weight:500;
      letter-spacing:0.2em;text-transform:uppercase;cursor:pointer;
      transition:all 0.18s;white-space:nowrap;border-radius:2px;
    }
    .autofill-btn:hover{background:#A8002A;box-shadow:0 4px 14px rgba(203,0,51,0.25);}

    /* ── FORM SECTIONS ── */
    .fsec{margin-bottom:32px;}
    .fsl{
      font-size:8px;letter-spacing:0.3em;color:#CB0033;text-transform:uppercase;
      margin-bottom:16px;padding-bottom:10px;border-bottom:2px solid #F2D0D8;
      display:flex;align-items:center;gap:10px;
    }
    .fsl-opt{font-size:7px;letter-spacing:0.18em;color:#A08070;background:#F4F0EC;padding:3px 8px;border:1px solid #E8DDD5;border-radius:2px;}

    .fgrid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
    .fg{display:flex;flex-direction:column;gap:5px;margin-bottom:4px;}
    .fg.full{grid-column:1/-1;}
    .fl{font-size:10px;font-weight:500;letter-spacing:0.08em;color:#6B4A38;}
    .fl .req{color:#CB0033;margin-left:2px;}

    .fi,.fsel{
      background:#FFFFFF;border:1.5px solid #E8DDD5;color:#2A1A10;
      font-family:'DM Sans',sans-serif;font-size:13px;padding:11px 13px;
      outline:none;transition:border-color 0.2s,box-shadow 0.2s;width:100%;
      border-radius:3px;
    }
    .fi:focus,.fsel:focus{border-color:#CB0033;box-shadow:0 0 0 3px rgba(203,0,51,0.08);}
    .fi::placeholder{color:#C4B0A0;}
    .fsel{cursor:pointer;}
    .ferr{font-size:10px;color:#CB0033;margin-top:3px;font-weight:500;}

    /* ── PRODUCT CARD ── */
    .prod-card{
      background:#FFFFFF;border:1.5px solid #E8DDD5;padding:22px;
      margin-bottom:16px;position:relative;animation:fu 0.25s ease;
      border-radius:4px;box-shadow:0 2px 8px rgba(42,26,16,0.04);
    }
    .prod-card-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;}
    .prod-card-num{
      font-size:8px;letter-spacing:0.25em;color:#FFFFFF;text-transform:uppercase;
      background:#CB0033;padding:3px 10px;border-radius:2px;
    }
    .prod-card-name{font-family:'Playfair Display',serif;font-size:15px;color:#2A1A10;margin-left:10px;font-style:italic;}
    .remove-btn{
      padding:5px 12px;border:1.5px solid #E8DDD5;background:#FFFFFF;
      color:#A08070;font-size:10px;letter-spacing:0.1em;cursor:pointer;
      font-family:'DM Sans',sans-serif;transition:all 0.18s;border-radius:2px;
    }
    .remove-btn:hover{border-color:#CB0033;color:#CB0033;}

    .add-prod-btn{
      width:100%;padding:14px;border:2px dashed #D6C8BC;background:#FAF7F4;
      color:#A08070;font-family:'DM Sans',sans-serif;font-size:11px;
      font-weight:500;letter-spacing:0.15em;text-transform:uppercase;
      cursor:pointer;transition:all 0.2s;margin-bottom:24px;border-radius:3px;
    }
    .add-prod-btn:hover{border-color:#CB0033;color:#CB0033;background:#FFF5F7;}

    /* ── PLATFORM TAGS ── */
    .ptag-row{display:flex;flex-wrap:wrap;gap:8px;}
    .ptag{
      padding:8px 14px;font-size:10px;font-weight:500;letter-spacing:0.1em;
      text-transform:uppercase;border:1.5px solid #E8DDD5;background:#FFFFFF;
      color:#A08070;cursor:pointer;font-family:'DM Sans',sans-serif;
      transition:all 0.18s;border-radius:3px;
    }
    .ptag.on{border-color:#CB0033;color:#CB0033;background:#FFF5F7;}
    .ptag:hover:not(.on){border-color:#A47860;color:#A47860;}

    /* ── GENERATE BUTTON ── */
    .gen-btn{
      width:100%;padding:17px;background:#CB0033;color:#FFFFFF;border:none;
      font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;
      letter-spacing:0.25em;text-transform:uppercase;cursor:pointer;
      margin-top:28px;transition:all 0.2s;border-radius:3px;
    }
    .gen-btn:hover{background:#A8002A;box-shadow:0 6px 20px rgba(203,0,51,0.3);}

    /* ── LOADING ── */
    .lw{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:82vh;gap:28px;}
    .llogo{font-family:'Playfair Display',serif;font-size:28px;color:#CB0033;letter-spacing:0.04em;}
    .lsub{font-size:9px;letter-spacing:0.28em;color:#A08070;text-transform:uppercase;}
    .lbar-bg{width:260px;height:3px;background:#E8DDD5;border-radius:2px;overflow:hidden;}
    .lbar{height:3px;background:linear-gradient(90deg,#CB0033,#A47860);border-radius:2px;animation:ls 1.5s ease-in-out infinite;}
    @keyframes ls{0%{transform:translateX(-100%)}100%{transform:translateX(400%)}}

    /* ── RESULTS LAYOUT ── */
    .rw{display:flex;min-height:calc(100vh - 65px);}

    /* Sidebar */
    .rsb{
      width:210px;border-right:1px solid #E8DDD5;padding:28px 0;
      background:#FFFFFF;flex-shrink:0;
    }
    .rsbl{font-size:8px;letter-spacing:0.28em;color:#A08070;padding:0 20px 12px;text-transform:uppercase;}

    /* Progress widget */
    .overall-prog{margin:0 16px 20px;padding:14px;background:#FAF7F4;border:1px solid #E8DDD5;border-radius:4px;}
    .op-label{font-size:9px;font-weight:500;letter-spacing:0.14em;color:#6B4A38;text-transform:uppercase;margin-bottom:8px;display:flex;justify-content:space-between;}
    .op-label span{color:#CB0033;font-family:'DM Mono',monospace;}
    .op-bar-bg{height:4px;background:#E8DDD5;border-radius:3px;}
    .op-bar{height:4px;background:linear-gradient(90deg,#CB0033,#A47860);border-radius:3px;transition:width 0.5s ease;}

    .rni{
      display:flex;align-items:center;gap:10px;padding:11px 20px;
      cursor:pointer;border-left:3px solid transparent;background:none;
      border-right:none;border-top:none;border-bottom:none;
      width:100%;text-align:left;font-family:'DM Sans',sans-serif;
      transition:all 0.18s;
    }
    .rni:hover{background:#FAF7F4;}
    .rni.on{border-left-color:#CB0033;background:#FFF5F7;}
    .rni-icon{font-size:13px;}
    .rni-label{font-size:10px;font-weight:500;letter-spacing:0.06em;color:#A08070;}
    .rni.on .rni-label{color:#CB0033;}

    /* Main content */
    .rm{flex:1;padding:36px 44px;overflow-y:auto;background:#FAF7F4;}
    .rh{margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid #E8DDD5;}
    .rt{font-family:'Playfair Display',serif;font-size:30px;font-weight:400;color:#2A1A10;}
    .rt em{color:#CB0033;font-style:italic;}
    .rs{font-size:10px;letter-spacing:0.12em;color:#A08070;margin-top:5px;text-transform:uppercase;}

    /* ── INFERRED BANNER ── */
    .inf-banner{
      background:#FFF5F7;border:1px solid #F2D0D8;border-left:3px solid #CB0033;
      padding:14px 18px;margin-bottom:22px;animation:fu 0.3s ease;border-radius:0 4px 4px 0;
    }
    .inf-label{font-size:8px;letter-spacing:0.22em;color:#CB0033;text-transform:uppercase;margin-bottom:6px;font-weight:600;}
    .inf-txt{font-size:12px;color:#6B4A38;line-height:1.7;}

    /* ── TEAM / PLATFORM TABS ── */
    .ttabs{display:flex;gap:0;border-bottom:2px solid #E8DDD5;margin-bottom:22px;overflow-x:auto;background:#FFFFFF;border-radius:4px 4px 0 0;padding:0 4px;}
    .ttab{
      padding:12px 16px;font-size:10px;font-weight:500;letter-spacing:0.1em;
      text-transform:uppercase;border:none;background:none;cursor:pointer;
      border-bottom:2px solid transparent;margin-bottom:-2px;
      font-family:'DM Sans',sans-serif;color:#A08070;transition:all 0.18s;
      white-space:nowrap;
    }
    .ttab:hover{color:#6B4A38;}
    .ttab.on{color:#2A1A10;}
    .ttab-prog{font-size:9px;margin-left:5px;font-family:'DM Mono',monospace;}

    /* ── TEAM PROGRESS ── */
    .team-prog-wrap{margin-bottom:18px;}
    .team-prog-meta{font-size:10px;font-weight:500;color:#6B4A38;margin-bottom:7px;display:flex;justify-content:space-between;}
    .team-prog-meta span{color:#CB0033;font-family:'DM Mono',monospace;}
    .team-prog-bar{height:3px;background:#E8DDD5;border-radius:2px;}
    .team-prog-fill{height:3px;background:linear-gradient(90deg,#CB0033,#A47860);border-radius:2px;transition:width 0.4s ease;}

    /* ── WEEK LABELS ── */
    .wk-label{
      font-size:9px;font-weight:600;letter-spacing:0.22em;color:#CB0033;
      text-transform:uppercase;margin:22px 0 10px;padding:8px 14px;
      background:#FFF5F7;border-left:3px solid #CB0033;border-radius:0 3px 3px 0;
    }
    .wk-label:first-child{margin-top:0;}

    /* ── CHECKLIST ITEMS ── */
    .chk-item{
      display:flex;align-items:flex-start;gap:12px;padding:13px 16px;
      background:#FFFFFF;border:1.5px solid #E8DDD5;margin-bottom:6px;
      cursor:pointer;transition:all 0.18s;user-select:none;border-radius:4px;
    }
    .chk-item:hover{border-color:#A47860;box-shadow:0 2px 8px rgba(164,120,96,0.1);}
    .chk-item.done-item{opacity:0.5;background:#FAF7F4;}
    .chk-box{
      width:18px;height:18px;border:2px solid #D6C8BC;border-radius:4px;
      flex-shrink:0;margin-top:1px;display:flex;align-items:center;
      justify-content:center;transition:all 0.18s;background:#FFFFFF;
    }
    .chk-item:hover .chk-box{border-color:#A47860;}
    .chk-item.done-item .chk-box{background:#CB0033;border-color:#CB0033;}
    .chk-tick{color:#FFFFFF;font-size:10px;display:none;font-weight:700;}
    .chk-item.done-item .chk-tick{display:block;}
    .chk-body{flex:1;}
    .chk-txt{font-size:13px;color:#2A1A10;line-height:1.55;}
    .chk-item.done-item .chk-txt{text-decoration:line-through;color:#A08070;}
    .chk-meta{display:flex;align-items:center;gap:10px;margin-top:5px;}
    .chk-owner{font-size:10px;color:#A08070;font-weight:500;}
    .chk-pri{font-size:8px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;padding:2px 8px;border:1.5px solid;border-radius:2px;}

    /* ── BRIEF CARD ── */
    .bcard{background:#FFFFFF;border:1.5px solid #E8DDD5;padding:28px;animation:fu 0.28s ease;border-radius:4px;box-shadow:0 2px 12px rgba(42,26,16,0.05);}
    @keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    .bsl{font-size:8px;font-weight:700;letter-spacing:0.26em;color:#A08070;text-transform:uppercase;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #E8DDD5;}
    .bobj{font-family:'Playfair Display',serif;font-size:16px;color:#2A1A10;line-height:1.7;margin-bottom:22px;font-weight:400;}
    .b2col{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:22px;}
    .blist{list-style:none;display:flex;flex-direction:column;gap:10px;}
    .blist li{display:flex;gap:10px;font-size:12px;line-height:1.55;color:#6B4A38;}
    .blist li::before{content:"▸";color:#CB0033;flex-shrink:0;font-size:11px;margin-top:1px;}
    .bdl{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border:1.5px solid #CB0033;font-size:10px;font-weight:600;letter-spacing:0.14em;color:#CB0033;border-radius:3px;}
    .bnote{margin-top:18px;padding:14px 16px;background:#FFF8F5;border-left:3px solid #A47860;font-size:12px;color:#6B4A38;line-height:1.65;border-radius:0 4px 4px 0;}

    /* ── COPY BLOCKS ── */
    .copy-prod-tabs{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:18px;}
    .copy-ptab{
      padding:7px 13px;font-size:10px;font-weight:500;letter-spacing:0.1em;
      text-transform:uppercase;border:1.5px solid #E8DDD5;background:#FFFFFF;
      color:#A08070;cursor:pointer;font-family:'DM Sans',sans-serif;
      transition:all 0.18s;border-radius:3px;
    }
    .copy-ptab.on{border-color:#CB0033;color:#CB0033;background:#FFF5F7;}
    .cblock{background:#FFFFFF;border:1.5px solid #E8DDD5;padding:20px;margin-bottom:12px;animation:fu 0.2s ease;border-radius:4px;}
    .cfl{font-size:8px;font-weight:700;letter-spacing:0.24em;color:#A08070;text-transform:uppercase;margin-bottom:8px;}
    .cfv{font-size:12px;color:#2A1A10;line-height:1.7;white-space:pre-wrap;}
    .ctrow{display:flex;flex-wrap:wrap;gap:7px;margin-top:4px;}
    .ctag{font-size:10px;padding:4px 10px;background:#F4F0EC;color:#6B4A38;border-radius:3px;font-weight:500;}
    .csub{font-size:9px;font-weight:700;letter-spacing:0.2em;color:#CB0033;text-transform:uppercase;margin:18px 0 10px;padding-bottom:6px;border-bottom:1px solid #E8DDD5;}

    /* ── CALENDAR ── */
    .cal-theme{font-family:'Playfair Display',serif;font-size:18px;color:#2A1A10;margin-bottom:18px;animation:fu 0.25s ease;}
    .calday{display:flex;gap:14px;align-items:flex-start;padding:13px 0;border-bottom:1px solid #E8DDD5;}
    .calday:last-child{border-bottom:none;}
    .cd-day{font-size:9px;font-weight:600;letter-spacing:0.1em;color:#A08070;width:50px;flex-shrink:0;padding-top:2px;text-transform:uppercase;}
    .cd-team{font-size:10px;font-weight:500;color:#A47860;width:100px;flex-shrink:0;padding-top:2px;}
    .cd-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:4px;}
    .cd-action{font-size:12px;color:#2A1A10;line-height:1.55;flex:1;}

    /* ── IMAGE PROMPTS ── */
    .img-top{display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap;}
    .img-type-btn{
      padding:8px 14px;font-size:10px;font-weight:500;letter-spacing:0.1em;
      text-transform:uppercase;border:1.5px solid #E8DDD5;background:#FFFFFF;
      color:#A08070;cursor:pointer;font-family:'DM Sans',sans-serif;
      transition:all 0.18s;border-radius:3px;
    }
    .img-type-btn.on{border-color:#CB0033;color:#CB0033;background:#FFF5F7;}
    .img-prod-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px;}
    .img-prod-btn{
      padding:7px 13px;font-size:10px;font-weight:500;letter-spacing:0.08em;
      text-transform:uppercase;border:1.5px solid #E8DDD5;background:#FFFFFF;
      color:#A08070;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.18s;border-radius:3px;
    }
    .img-prod-btn.on{border-color:#A47860;color:#A47860;background:#FFF8F5;}
    .img-prompt-card{background:#FFFFFF;border:1.5px solid #E8DDD5;padding:24px;animation:fu 0.28s ease;border-radius:4px;box-shadow:0 2px 12px rgba(42,26,16,0.05);}
    .img-prompt-label{font-size:8px;font-weight:700;letter-spacing:0.22em;color:#A47860;text-transform:uppercase;margin-bottom:10px;}
    .img-prompt-text{font-size:12px;color:#2A1A10;line-height:1.75;white-space:pre-wrap;}
    .img-note{margin-top:16px;padding:14px 16px;background:#FFF5F7;border-left:3px solid #CB0033;font-size:11px;color:#6B4A38;line-height:1.65;border-radius:0 4px 4px 0;}
    .copy-prompt-btn{
      margin-top:14px;padding:10px 18px;border:1.5px solid #A47860;
      background:#FFFFFF;color:#A47860;font-family:'DM Sans',sans-serif;
      font-size:10px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;
      cursor:pointer;transition:all 0.18s;border-radius:3px;
    }
    .copy-prompt-btn:hover{background:#A47860;color:#FFFFFF;}
    .gen-img-btn{
      padding:12px 22px;background:#CB0033;color:#FFFFFF;border:none;
      font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;
      letter-spacing:0.22em;text-transform:uppercase;cursor:pointer;
      transition:all 0.2s;margin-bottom:20px;border-radius:3px;
    }
    .gen-img-btn:hover{background:#A8002A;box-shadow:0 4px 14px rgba(203,0,51,0.25);}
    .gen-img-btn:disabled{opacity:0.4;cursor:not-allowed;}
    .img-loading{font-size:10px;font-weight:500;letter-spacing:0.18em;color:#A08070;text-transform:uppercase;padding:20px 0;}
    .img-empty{padding:40px 0;text-align:center;color:#C4B0A0;font-size:12px;letter-spacing:0.08em;}

    /* ── PRESET MODAL ── */
    .preset-overlay{position:fixed;inset:0;background:rgba(42,26,16,0.5);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;animation:fu 0.2s ease;}
    .preset-modal{background:#FFFFFF;border:1.5px solid #E8DDD5;max-width:540px;width:100%;max-height:82vh;overflow-y:auto;border-radius:6px;box-shadow:0 20px 60px rgba(42,26,16,0.2);}
    .preset-modal-header{padding:22px 26px;border-bottom:1px solid #E8DDD5;display:flex;justify-content:space-between;align-items:flex-start;background:#FAF7F4;border-radius:6px 6px 0 0;}
    .preset-modal-title{font-family:'Playfair Display',serif;font-size:20px;color:#2A1A10;}
    .preset-modal-sub{font-size:10px;color:#A08070;margin-top:3px;}
    .preset-close{background:#FFFFFF;border:1.5px solid #E8DDD5;color:#A08070;font-family:'DM Sans',sans-serif;font-size:10px;font-weight:500;letter-spacing:0.1em;padding:7px 14px;cursor:pointer;transition:all 0.18s;border-radius:3px;}
    .preset-close:hover{border-color:#CB0033;color:#CB0033;}
    .preset-list{padding:18px;}
    .preset-card{background:#FAF7F4;border:1.5px solid #E8DDD5;padding:18px 20px;margin-bottom:12px;cursor:pointer;transition:all 0.18s;border-radius:4px;}
    .preset-card:hover{border-color:#CB0033;background:#FFF5F7;box-shadow:0 4px 12px rgba(203,0,51,0.08);}
    .preset-card-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
    .preset-card-name{font-family:'Playfair Display',serif;font-size:16px;color:#2A1A10;}
    .preset-card-count{font-size:8px;font-weight:700;letter-spacing:0.2em;color:#CB0033;text-transform:uppercase;padding:3px 10px;border:1.5px solid #CB0033;border-radius:2px;}
    .preset-products{display:flex;flex-wrap:wrap;gap:6px;}
    .preset-prod-tag{font-size:10px;padding:4px 10px;background:#F4F0EC;color:#6B4A38;border-radius:3px;font-weight:500;}
    .preset-date{font-size:10px;color:#A08070;margin-top:8px;}
    .use-preset-btn{
      width:100%;padding:11px;background:#CB0033;color:#FFFFFF;border:none;
      font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;
      letter-spacing:0.22em;text-transform:uppercase;cursor:pointer;
      margin-top:14px;transition:all 0.2s;border-radius:3px;
    }
    .use-preset-btn:hover{background:#A8002A;}

    /* ── RESET BUTTON ── */
    .reset-btn{
      padding:9px 18px;border:1.5px solid #E8DDD5;background:#FFFFFF;
      color:#A08070;font-family:'DM Sans',sans-serif;font-size:10px;
      font-weight:500;letter-spacing:0.15em;text-transform:uppercase;
      cursor:pointer;transition:all 0.18s;border-radius:3px;
    }
    .reset-btn:hover{border-color:#CB0033;color:#CB0033;}

    /* ── ANIMATIONS ── */
    @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

    /* ── RESPONSIVE ── */
    @media(max-width:680px){
      .fgrid{grid-template-columns:1fr;} .b2col{grid-template-columns:1fr;}
      .rsb{width:50px;} .rni-label{display:none;} .rni{justify-content:center;padding:12px;}
      .rm{padding:20px 14px;} .fw{padding:28px 14px;}
      .topbar{padding:0 14px;}
      .topbar-tag{display:none;}
    }
  `;

  // ── FORM ──────────────────────────────────────────────────────────────────
  if(step==="form") return (
    <><style>{css}</style>
    <div className="app">
      <div className="topbar">
        <div className="topbar-brand">
          <div className="topbar-accent"/>
          <div><div className="brand">Sunbeams Lifestyle</div><div className="brand-sub">Product Launch Hub</div></div>
        </div>
        <div className="topbar-mid">
          <span className="topbar-tag">All Channels</span>
          <span className="topbar-tag">2–4 Week Sprint</span>
        </div>
      </div>
      <div className="fw">
        {/* Preset modal */}
        {showPresets&&(
          <div className="preset-overlay" onClick={()=>setShowPresets(false)}>
            <div className="preset-modal" onClick={e=>e.stopPropagation()}>
              <div className="preset-modal-header">
                <div>
                  <div className="preset-modal-title">Quick-Fill Templates</div>
                  <div className="preset-modal-sub">Select a template to auto-populate all fields</div>
                </div>
                <button className="preset-close" onClick={()=>setShowPresets(false)}>✕ Close</button>
              </div>
              <div className="preset-list">
                {DEMO_PRESETS.map((preset,i)=>(
                  <div key={i} className="preset-card">
                    <div className="preset-card-top">
                      <div className="preset-card-name">{preset.brandInfo.collectionName||preset.label}</div>
                      <span className="preset-card-count">{preset.products.length} Product{preset.products.length>1?"s":""}</span>
                    </div>
                    <div className="preset-products">
                      {preset.products.map((p,j)=>(
                        <span key={j} className="preset-prod-tag">{p.productName} · {p.category}</span>
                      ))}
                    </div>
                    <div className="preset-date">Launch in ~4 weeks · {preset.brandInfo.platforms.join(", ")}</div>
                    <button className="use-preset-btn" onClick={()=>applyPreset(preset)}>
                      ◈ &nbsp; Use This Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="form-eyebrow">Sunbeams Lifestyle · Product Launch</div>
        <h1 className="form-title">Launch a <em>Collection</em></h1>
        <p className="form-desc">Fill in the details — key benefits &amp; audience auto-generated per product</p>

        {/* Auto-fill bar */}
        <div className="autofill-bar">
          <div className="autofill-label">
            Want to go faster?
            <span>Use a pre-filled template to generate instantly</span>
          </div>
          <button className="autofill-btn" onClick={()=>setShowPresets(true)}>
            ⚡ Auto-Fill Template
          </button>
        </div>

        {/* Collection-level */}
        <div className="fsec">
          <div className="fsl">Collection Details</div>
          <div className="fgrid">
            <div className="fg">
              <label className="fl">Brand Name <span className="req">*</span></label>
              <input className="fi" placeholder="e.g. Sunbeams Lifestyle" value={brandInfo.brandName} onChange={e=>setBrand("brandName",e.target.value)}/>
              {errors.brandName&&<span className="ferr">{errors.brandName}</span>}
            </div>
            <div className="fg">
              <label className="fl">Collection Name <span style={{color:"#5A3828",marginLeft:2}}>optional</span></label>
              <input className="fi" placeholder="e.g. Golden Hour" value={brandInfo.collectionName} onChange={e=>setBrand("collectionName",e.target.value)}/>
            </div>
            <div className="fg">
              <label className="fl">Launch Date <span className="req">*</span></label>
              <input className="fi" type="date" value={brandInfo.launchDate} onChange={e=>setBrand("launchDate",e.target.value)}/>
              {errors.launchDate&&<span className="ferr">{errors.launchDate}</span>}
            </div>
          </div>
        </div>

        {/* Brand Identity */}
        <div className="fsec">
          <div className="fsl">Brand Identity <span className="fsl-opt">All Optional</span></div>
          <div className="fgrid">
            <div className="fg">
              <label className="fl">Brand Colors</label>
              <input className="fi" placeholder="e.g. #CB0033, #A47860, #F4F0EC" value={brandInfo.brandColors} onChange={e=>setBrand("brandColors",e.target.value)}/>
            </div>
            <div className="fg">
              <label className="fl">Brand Typeface</label>
              <input className="fi" placeholder="e.g. Playfair Display, Garamond" value={brandInfo.brandTypeface} onChange={e=>setBrand("brandTypeface",e.target.value)}/>
            </div>
            <div className="fg">
              <label className="fl">Packaging Dimensions</label>
              <input className="fi" placeholder="e.g. 10cm × 5cm × 5cm box" value={brandInfo.packagingDimensions} onChange={e=>setBrand("packagingDimensions",e.target.value)}/>
            </div>
            <div className="fg">
              <label className="fl">Logo / Brand Reference URL</label>
              <input className="fi" placeholder="e.g. https://drive.google.com/..." value={brandInfo.logoUrl} onChange={e=>setBrand("logoUrl",e.target.value)}/>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="fsec">
          <div className="fsl">Products in this Collection</div>
          {errors.products&&<div style={{fontSize:10,color:B.primary,marginBottom:10,letterSpacing:"0.1em"}}>{errors.products}</div>}
          {products.map((p,idx)=>(
            <div key={p.id} className="prod-card">
              <div className="prod-card-header">
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span className="prod-card-num">Product {idx+1}</span>
                  {p.productName&&<span className="prod-card-name">{p.productName}</span>}
                </div>
                {products.length>1&&<button className="remove-btn" onClick={()=>removeProduct(p.id)}>Remove</button>}
              </div>
              <div className="fgrid">
                <div className="fg">
                  <label className="fl">Product Name <span className="req">*</span></label>
                  <input className="fi" placeholder="e.g. Glow Serum" value={p.productName} onChange={e=>setProduct(p.id,"productName",e.target.value)}/>
                </div>
                <div className="fg">
                  <label className="fl">Category</label>
                  <select className="fsel" value={p.category} onChange={e=>setProduct(p.id,"category",e.target.value)}>
                    {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="fg">
                  <label className="fl">Size / Capacity</label>
                  <input className="fi" placeholder="e.g. 30ml, 500g" value={p.size} onChange={e=>setProduct(p.id,"size",e.target.value)}/>
                </div>
                <div className="fg">
                  <label className="fl">Colour</label>
                  <input className="fi" placeholder="e.g. Rose Gold, Ivory" value={p.color} onChange={e=>setProduct(p.id,"color",e.target.value)}/>
                </div>
                <div className="fg">
                  <label className="fl">Shape / Design</label>
                  <input className="fi" placeholder="e.g. Dropper bottle" value={p.shape} onChange={e=>setProduct(p.id,"shape",e.target.value)}/>
                </div>
                <div className="fg">
                  <label className="fl">Dimensions</label>
                  <input className="fi" placeholder="e.g. 12cm × 4cm" value={p.dimensions} onChange={e=>setProduct(p.id,"dimensions",e.target.value)}/>
                </div>
                <div className="fg full">
                  <label className="fl">Inclusions</label>
                  <input className="fi" placeholder="e.g. Serum, dropper, gift box, instruction card" value={p.inclusions} onChange={e=>setProduct(p.id,"inclusions",e.target.value)}/>
                </div>
                <div className="fg">
                  <label className="fl">Warranty Type</label>
                  <input className="fi" placeholder="e.g. Manufacturer warranty" value={p.warranty} onChange={e=>setProduct(p.id,"warranty",e.target.value)}/>
                </div>
                <div className="fg">
                  <label className="fl">Warranty Duration</label>
                  <input className="fi" placeholder="e.g. 1 year" value={p.warrantyDuration} onChange={e=>setProduct(p.id,"warrantyDuration",e.target.value)}/>
                </div>
                <div className="fg">
                  <label className="fl">Price Point</label>
                  <input className="fi" placeholder="e.g. RM 89" value={p.pricePoint} onChange={e=>setProduct(p.id,"pricePoint",e.target.value)}/>
                </div>
                <div className="fg">
                  <label className="fl">Special Offer</label>
                  <input className="fi" placeholder="e.g. 20% off launch" value={p.specialOffer} onChange={e=>setProduct(p.id,"specialOffer",e.target.value)}/>
                </div>
              </div>
            </div>
          ))}
          <button className="add-prod-btn" onClick={addProduct}>+ Add Another Product to this Collection</button>
        </div>

        {/* Channels */}
        <div className="fsec">
          <div className="fsl">Launch Channels</div>
          <div className="ptag-row">
            {PLATFORMS.map(p=>(
              <button key={p} className={`ptag ${brandInfo.platforms.includes(p)?"on":""}`} onClick={()=>togglePlat(p)}>{p}</button>
            ))}
          </div>
        </div>

        <button className="gen-btn" onClick={generate}>◈ &nbsp; Generate Full Launch Plan</button>
      </div>
    </div></>
  );

  // ── LOADING ───────────────────────────────────────────────────────────────
  if(step==="loading") return (
    <><style>{css}</style>
    <div className="app">
      <div className="topbar"><div><div className="brand">Sunbeams Lifestyle</div></div></div>
      <div className="lw">
        <div className="llogo">{brandInfo.collectionName||brandInfo.brandName}</div>
        <div className="lbar-bg"><div className="lbar"/></div>
        <div className="llabel">Building your launch plan…</div>
      </div>
    </div></>
  );

  // ── RESULTS ───────────────────────────────────────────────────────────────
  const navItems=[
    {id:"tasks",   icon:"◻",label:"Checklists"},
    {id:"briefs",  icon:"⬡",label:"Briefs"},
    {id:"copy",    icon:"▲",label:"Copy"},
    {id:"calendar",icon:"◈",label:"Calendar"},
    {id:"images",  icon:"✦",label:"Images"},
  ];

  const prog=allProg();

  // tasks
  const renderTasks=()=>{
    const {done,total,pct}=taskProg(selTeam);
    const items=results.tasks?.[selTeam]||[];
    const grouped={};
    items.forEach((t,i)=>{const w=`Week ${t.week}`;(grouped[w]=grouped[w]||[]).push({...t,idx:i});});
    const mainInf=results.inferred?.[products[0]?.id]||{};
    return (
      <div>
        <div className="inf-banner">
          <div className="inf-label">Auto-Generated — Benefit &amp; Audience per Product</div>
          {products.map(p=>{
            const inf=results.inferred?.[p.id]||{};
            return (
              <div key={p.id} className="inf-txt" style={{marginBottom:4}}>
                <strong style={{color:"#CB0033"}}>{p.productName}:</strong> {inf.keyBenefit} · <em style={{color:"#7A5540"}}>{inf.targetCustomer}</em>
              </div>
            );
          })}
        </div>
        <div className="ttabs">
          {TEAMS.map(t=>{
            const {pct:p}=taskProg(t.id);
            return (
              <button key={t.id} className={`ttab ${selTeam===t.id?"on":""}`}
                style={selTeam===t.id?{borderBottomColor:t.color,color:t.color}:{}}
                onClick={()=>setSelTeam(t.id)}>
                {t.icon} {t.label}<span className="ttab-prog">{p}%</span>
              </button>
            );
          })}
        </div>
        <div className="team-prog-wrap">
          <div className="team-prog-meta"><span>{done} of {total} done</span><span>{pct}%</span></div>
          <div className="team-prog-bar"><div className="team-prog-fill" style={{width:`${pct}%`}}/></div>
        </div>
        {Object.entries(grouped).map(([wk,tItems])=>(
          <div key={wk}>
            <div className="wk-label">{wk}</div>
            {tItems.map(t=>{
              const key=`${selTeam}-${t.idx}`;
              const isDone=taskState[key];
              const pc=t.priority==="high"?"#CB0033":t.priority==="medium"?"#A47860":"#D6D2C4";
              return (
                <div key={key} className={`chk-item ${isDone?"done-item":""}`} onClick={()=>toggleTask(key)}>
                  <div className="chk-box"><span className="chk-tick">✓</span></div>
                  <div className="chk-body">
                    <div className="chk-txt">{t.task}</div>
                    <div className="chk-meta">
                      <span className="chk-owner">{t.owner}</span>
                      <span className="chk-pri" style={{color:pc,borderColor:pc}}>{t.priority}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // briefs
  const renderBriefs=()=>{
    const b=results.briefs?.[selTeam]; if(!b) return null;
    return (
      <div key={selTeam}>
        <div className="ttabs">
          {TEAMS.map(t=>(
            <button key={t.id} className={`ttab ${selTeam===t.id?"on":""}`}
              style={selTeam===t.id?{borderBottomColor:t.color,color:t.color}:{}}
              onClick={()=>setSelTeam(t.id)}>{t.icon} {t.label}</button>
          ))}
        </div>
        <div className="bcard">
          <div className="bsl">Objective</div>
          <div className="bobj">{b.objective}</div>
          <div className="b2col">
            <div><div className="bsl">Deliverables</div><ul className="blist">{(b.deliverables||[]).map((d,i)=><li key={i}>{d}</li>)}</ul></div>
            <div><div className="bsl">Guidelines</div><ul className="blist">{(b.guidelines||[]).map((g,i)=><li key={i}>{g}</li>)}</ul></div>
          </div>
          <div className="bdl">◷ &nbsp;Deadline: {b.deadline}</div>
          {b.notes&&<div className="bnote">Note — {b.notes}</div>}
        </div>
      </div>
    );
  };

  // copy
  const renderCopy=()=>{
    const platKeys=Object.keys(results.copy||{});
    const d=results.copy?.[selPlat]; if(!d) return null;
    const renderVal=(label,val)=>{
      if(!val) return null;
      if(Array.isArray(val)) return (
        <div className="cblock" key={label}><div className="cfl">{label}</div><div className="ctrow">{val.map((v,i)=><span key={i} className="ctag">{v}</span>)}</div></div>
      );
      if(typeof val==="object") return null;
      return <div className="cblock" key={label}><div className="cfl">{label}</div><div className="cfv">{val}</div></div>;
    };

    // Flatten nested product arrays into readable sections
    const renderPlatCopy=(data)=>{
      const sections=[];
      Object.entries(data).forEach(([k,v])=>{
        if(k==="products"&&Array.isArray(v)){
          v.forEach(prod=>{
            sections.push(<div key={prod.name} className="csub">— {prod.name}</div>);
            Object.entries(prod).filter(([kk])=>kk!=="name").forEach(([kk,vv])=>{
              sections.push(renderVal(kk.replace(/([A-Z])/g," $1").trim().toUpperCase(),vv));
            });
          });
        } else {
          sections.push(renderVal(k.replace(/([A-Z])/g," $1").trim().toUpperCase(),v));
        }
      });
      return sections;
    };

    return (
      <div>
        <div className="copy-prod-tabs">
          {platKeys.map(p=>(
            <button key={p} className={`copy-ptab ${selPlat===p?"on":""}`} onClick={()=>setSelPlat(p)}>
              {p.charAt(0).toUpperCase()+p.slice(1)}
            </button>
          ))}
        </div>
        <div key={selPlat} style={{animation:"fu 0.22s ease"}}>
          {renderPlatCopy(d)}
        </div>
      </div>
    );
  };

  // calendar
  const renderCalendar=()=>{
    const weeks=Object.keys(results.calendar||{});
    const w=results.calendar?.[selWeek]; if(!w) return null;
    return (
      <div>
        <div className="ttabs">
          {weeks.map(wk=>(
            <button key={wk} className={`ttab ${selWeek===wk?"on":""}`}
              style={selWeek===wk?{borderBottomColor:"#CB0033",color:"#CB0033"}:{}}
              onClick={()=>setSelWeek(wk)}>{wk.replace("week","Week ")}</button>
          ))}
        </div>
        <div className="cal-theme" key={selWeek}>{w.theme}</div>
        {(w.days||[]).map((d,i)=>(
          <div key={i} className="calday">
            <div className="cd-day">{d.day}</div>
            <div className="cd-team">{d.team}</div>
            <div className="cd-dot" style={{background:TypeColor[d.type]||"#A47860"}}/>
            <div className="cd-action" style={d.type==="launch"?{color:"#CB0033",fontWeight:500}:{}}>{d.action}</div>
          </div>
        ))}
      </div>
    );
  };

  // images
  const renderImages=()=>{
    const curProd=products[selProd]||products[0];
    const key=`${curProd.id}-${imgTab}`;
    const prompt=imgPrompts[key];
    return (
      <div>
        {/* Product selector */}
        {products.length>1&&(
          <div style={{marginBottom:14}}>
            <div className="cfl" style={{marginBottom:8}}>Select Product</div>
            <div className="img-prod-row">
              {products.map((p,i)=>(
                <button key={p.id} className={`img-prod-btn ${selProd===i?"on":""}`} onClick={()=>setSelProd(i)}>{p.productName||`Product ${i+1}`}</button>
              ))}
            </div>
          </div>
        )}

        {/* Image type */}
        <div className="cfl" style={{marginBottom:8}}>Image Type</div>
        <div className="img-top">
          {IMG_TYPES.map(t=>(
            <button key={t.id} className={`img-type-btn ${imgTab===t.id?"on":""}`} onClick={()=>setImgTab(t.id)}>{t.label}</button>
          ))}
        </div>

        <button className="gen-img-btn" disabled={imgLoading} onClick={genImagePrompt}>
          {imgLoading?"Optimizing prompt…":"◈ Generate Image Prompt"}
        </button>

        {imgLoading&&<div className="img-loading">Crafting prompt for {curProd.productName}…</div>}

        {prompt&&!imgLoading&&(
          <div className="img-prompt-card">
            <div className="img-prompt-label">Optimized Image Prompt — {IMG_TYPES.find(t=>t.id===imgTab)?.label} · {curProd.productName}</div>
            <div className="img-prompt-text">{prompt}</div>
            <div className="img-note">
              Copy this prompt and paste it into your preferred AI image tool:<br/>
              <strong>Midjourney</strong> — paste in Discord with /imagine<br/>
              <strong>DALL·E / ChatGPT</strong> — paste directly<br/>
              <strong>Adobe Firefly</strong> — paste in Text to Image<br/>
              <strong>Ideogram</strong> — paste at ideogram.ai<br/>
              <strong>Canva AI</strong> — paste in Magic Media
            </div>
            <button className="copy-prompt-btn" onClick={()=>navigator.clipboard?.writeText(prompt)}>Copy Prompt</button>
          </div>
        )}

        {!prompt&&!imgLoading&&(
          <div style={{padding:"32px 0",textAlign:"center",color:"#5A3828",fontSize:11,letterSpacing:"0.12em"}}>
            Select a product and image type, then click Generate Prompt.
          </div>
        )}
      </div>
    );
  };

  const renders={tasks:renderTasks,briefs:renderBriefs,copy:renderCopy,calendar:renderCalendar,images:renderImages};
  const colLabel=brandInfo.collectionName?` · ${brandInfo.collectionName} Collection`:"";

  return (
    <><style>{css}</style>
    <div className="app">
      <div className="topbar">
        <div className="topbar-brand">
          <div className="topbar-accent"/>
          <div><div className="brand">{brandInfo.brandName}</div><div className="brand-sub">{brandInfo.collectionName||"Product Launch"}</div></div>
        </div>
        <div className="topbar-mid">
          {products.map(p=>p.productName).filter(Boolean).map((n,i)=>(
            <span key={i} className="topbar-tag">{n}</span>
          ))}
        </div>
        <div className="topbar-right"><button className="reset-btn" onClick={reset}>← New Launch</button></div>
      </div>
      <div className="rw">
        <nav className="rsb">
          <div className="rsbl">Output</div>
          <div className="overall-prog">
            <div className="op-label">Progress <span>{prog}%</span></div>
            <div className="op-bar-bg"><div className="op-bar" style={{width:`${prog}%`}}/></div>
          </div>
          {navItems.map(n=>(
            <button key={n.id} className={`rni ${activeResult===n.id?"on":""}`} onClick={()=>setAR(n.id)}>
              <span className="rni-icon" style={{color:activeResult===n.id?"#CB0033":"#7A5540"}}>{n.icon}</span>
              <span className="rni-label">{n.label}</span>
            </button>
          ))}
        </nav>
        <main className="rm">
          <div className="rh">
            <h2 className="rt">
              {activeResult==="tasks"&&<><em>Task</em> Checklists</>}
              {activeResult==="briefs"&&<><em>Department</em> Briefs</>}
              {activeResult==="copy"&&<><em>Platform</em> Copy</>}
              {activeResult==="calendar"&&<><em>Launch</em> Calendar</>}
              {activeResult==="images"&&<><em>Image</em> Prompts</>}
            </h2>
            <p className="rs">{products.length} Product{products.length>1?"s":""}{colLabel} · {brandInfo.launchDate} · {brandInfo.platforms.join(" · ")}</p>
          </div>
          {renders[activeResult]?.()}
        </main>
      </div>
    </div></>
  );
}
