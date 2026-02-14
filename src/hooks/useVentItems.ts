import { useState, useCallback } from "react";
import { 
    listVentItems,
    createVentItem, 
    editVentItem,
    removeVentItem,
    type VentItem, 
    type VentItemPatch, 
    type CreateVentItemResult,
    type EditVentItemResult,
    type RemoveVentItemResult,
    type When,
 } from "../services/braindump";

export function useVentItems() {
      // Lazy init: runs useVentItems() only once on first render
        const [ventItems, setVentItems] = useState<VentItem[]>(() => listVentItems());
        //const [isLoading, setIsLoading] = useState(false);
    
        const refresh = useCallback(async () => {
           // setIsLoading(true);
            const next = await Promise.resolve(listVentItems()); // later: await api.listVents()
            setVentItems(next);
            //setIsLoading(false);
        }, []);
    
        async function create(title: string, when: When, stressLevel: number): Promise<CreateVentItemResult> {
            const result = createVentItem(title, when, stressLevel);
            if (!result.ok) return result;
            await refresh();
            return result;
        }
    
        async function edit(ventItemId: string, patch: VentItemPatch): Promise<EditVentItemResult> {
            const result = editVentItem(ventItemId, patch);
            if (!result.ok) return result;
            await refresh();
            return result;
        }

        async function remove(ventItemId: string): Promise<RemoveVentItemResult> {
            const result = removeVentItem(ventItemId);
            if (!result.ok) return result;
            await refresh();
            return result;
        }

    return { ventItems, refresh, create, edit, remove };
}