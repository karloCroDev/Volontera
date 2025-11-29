'use server';

// External packages
import { revalidatePath, revalidateTag } from 'next/cache';

export async function IRevalidateTag(tag: string) {
	revalidateTag(tag);
}
export async function IRevalidatePath(tag: string) {
	revalidatePath(tag);
}
