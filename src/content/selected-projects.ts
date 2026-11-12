import { chromatiqueMedia, imageGoNordMedia, supermarketMedia } from "./featured-media";
import type { GalleryMedia } from "@/lib/gallery";

export type SelectedProject = {
  id: string; title: string; summary: string; contribution: string;
  href: string; linkLabel: string; status?: string; media: readonly GalleryMedia[];
};

export const imageGoNordProject: SelectedProject = {
  id: "imagegonord", title: "ImageGoNord",
  summary: "An open-source tool for converting images into a chosen palette.",
  contribution: "I co-authored ImageGoNord with Wabri, alongside the work of the Schrödinger Hat community.",
  href: "https://github.com/Schroedinger-Hat/ImageGoNord-Web", linkLabel: "Explore ImageGoNord on GitHub", media: imageGoNordMedia,
};

export const supermarketProject: SelectedProject = {
  id: "supermarket", title: "Supermarket waiting times", status: "Archived project · 2020",
  summary: "A crowdsourced map of shop waiting times, built during lockdown.",
  contribution: "I built the service and evolved it from a Raspberry Pi to regional VPS infrastructure as demand grew.",
  href: "https://github.com/TheJoin95/covid19-market-waiting-times", linkLabel: "View the archived project", media: supermarketMedia,
};

export const chromatiqueProject: SelectedProject = {
  id: "chromatique", title: "Chromatique", status: "In development",
  summary: "One colour engine, several ways to use it: a Rust core with a CLI, language bindings and creative-tool interfaces.",
  contribution: "My work includes image analysis, image comparison and lightness-preserving palette selection.",
  href: "/media/chromatique/irises-nord.png", linkLabel: "View the generated output", media: chromatiqueMedia,
};

export const selectedProjects = [imageGoNordProject, supermarketProject, chromatiqueProject] as const;
