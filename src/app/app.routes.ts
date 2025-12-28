import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RechercheFormationsComponent } from './recherche-formations/recherche-formations.component';
import { FormationDetailsComponent } from './formation-details/formation-details.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { GestionFormateursComponent } from './admin/gestion-formateurs/gestion-formateurs.component';
import { GestionCategoriesComponent } from './admin/gestion-categories/gestion-categories.component';
import { GestionFormationsComponent } from './admin/gestion-formations/gestion-formations.component';
import { GestionSessionsComponent } from './admin/gestion-sessions/gestion-sessions.component';

export const routes: Routes = [
  // Public routes
  { path: '', component: HomeComponent },
  { path: 'formations', component: RechercheFormationsComponent },
  { path: 'formation/:id', component: FormationDetailsComponent },
  
  // Admin routes
  {
    path: 'admin-space',
    component: AdminLayoutComponent,
    children: [
      { path: 'formateurs', component: GestionFormateursComponent },
      { path: 'categories', component: GestionCategoriesComponent },
      { path: 'formations', component: GestionFormationsComponent },
      { path: 'sessions', component: GestionSessionsComponent },
      { path: '', redirectTo: 'formateurs', pathMatch: 'full' }
    ]
  }
];
