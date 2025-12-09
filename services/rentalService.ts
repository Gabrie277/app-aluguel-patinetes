/*
  Stub rentalService for Supabase integration.
  The Supabase integrator should implement these functions using `@supabase/supabase-js`.

  Expected functions:
  - getActiveRental(userId)
  - getRentalById(rentalId)
  - subscribeToRentalChanges(userId, callback)

  See `SUPABASE_INTEGRATION.md` at repo root for full instructions and examples.
*/

// Example placeholders (not functional) so imports don't break while the integrator works:
export type RentalRecord = {
  rentalId: string;
  durationInMinutes: number;
  startAt?: string;
  endsAt?: string;
};

export async function getActiveRental(userId: string): Promise<RentalRecord | null> {
  // TODO: Implement using Supabase
  // Example: call supabase.from('rentals').select(...).eq('user_id', userId).eq('status','active').single()
  console.warn('getActiveRental not implemented. Please implement Supabase logic.');
  return null;
}

export async function getRentalById(rentalId: string): Promise<RentalRecord | null> {
  // TODO: Implement using Supabase
  console.warn('getRentalById not implemented. Please implement Supabase logic.');
  return null;
}

export function subscribeToRentalChanges(userId: string, callback: (rental: any) => void) {
  // TODO: Implement realtime subscription with Supabase
  console.warn('subscribeToRentalChanges not implemented. Please implement Supabase realtime logic.');

  // Return an unsubscribe function placeholder
  return () => {};
}

// Placeholder for creating a rental. Integrator should implement real logic
// using Supabase or another backend. This helper simulates a created rental
// so mutation hooks can be tested locally.
export async function createRental(userId: string, durationInMinutes: number) {
  console.warn('createRental placeholder called — implement with Supabase for production.');
  return new Promise((resolve) => {
    const now = new Date();
    const endsAt = new Date(now.getTime() + durationInMinutes * 60 * 1000).toISOString();
    setTimeout(() =>
      resolve({
        rentalId: `rental_${Date.now()}`,
        durationInMinutes,
        startAt: now.toISOString(),
        endsAt,
      }),
    300);
  });
}


