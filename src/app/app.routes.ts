import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContentComponent } from './shared/content/content.component';
import { GeneralesComponent } from './pages/generales/generales.component';
import { EspecialidadesComponent } from './pages/especialidades/especialidades.component';
import { IntegralesComponent } from './pages/integrales/integrales.component';
import { PacksPreventivosComponent } from './pages/packs-preventivos/packs-preventivos.component';
import { KitsPreventivosComponent } from './pages/kits-preventivos/kits-preventivos.component';

export const routes: Routes = [
    {
        path: '',
        component: ContentComponent,
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: "generales",
                component: GeneralesComponent
            },
            {
                path: "especialidades",
                component: EspecialidadesComponent
            },
            {
                path: "integrales",
                component: IntegralesComponent
            },
            {
                path: "packs-preventivos",
                component: PacksPreventivosComponent
            },
            {
                path: "kits-preventivos",
                component: KitsPreventivosComponent
            }
        ]
    }, {
        path: '',
        redirectTo: 'content',
        pathMatch: 'full'
    }
];
