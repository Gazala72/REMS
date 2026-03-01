import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, take, filter } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.loading$.pipe(
        filter(loading => !loading),
        take(1),
        map(() => {
            const user = authService.currentUserValue;
            const roles = route.data['roles'] as Array<string>;

            if (user) {
                if (roles && roles.length > 0 && !roles.includes(user.role)) {
                    router.navigate(['/']);
                    return false;
                }
                return true;
            }

            router.navigate(['/login']);
            return false;
        })
    );
};
