import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContentComponent } from './shared/content/content.component';
import { GeneralesComponent } from './pages/generales/generales.component';
import { EspecialidadesComponent } from './pages/especialidades/especialidades.component';
import { IntegralesComponent } from './pages/integrales/integrales.component';
import { PacksPreventivosComponent } from './pages/packs-preventivos/packs-preventivos.component';
import { KitsPreventivosComponent } from './pages/kits-preventivos/kits-preventivos.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { PerfilMedicoComponent } from './pages/perfil-medico/perfil-medico.component';

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
            },
            {
                path: "contacto",
                component: ContactoComponent
            },
            {
                path: "register",
                component: RegisterComponent
            },
            {
                path: "login",
                component: LoginComponent
            },
            {
                path: "perfil",
                component: PerfilComponent
            },
            {
                path: "perfil-medico",
                component: PerfilMedicoComponent
            }
        ]
    }, {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
    }
];
