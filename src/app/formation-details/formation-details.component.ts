import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { Formation } from '../shared/formation.model';
import { Session } from '../shared/session.model';
import { Formateur } from '../shared/formateur.model';
import { Inscription } from '../shared/inscription.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-formation-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './formation-details.component.html',
  styleUrl: './formation-details.component.css'
})
export class FormationDetailsComponent implements OnInit {
  formation: Formation | null = null;
  sessions: Session[] = [];
  sessionsWithDetails: any[] = [];
  inscriptionForm!: FormGroup;
  selectedSessionId: string = '';
  showInscriptionModal: boolean = false;
  selectedSessionFormateurs: Formateur[] = [];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    const formationId = this.route.snapshot.paramMap.get('id');
    if (formationId) {
      this.getFormation(formationId);
      this.getSessions(formationId);
    }

    this.inscriptionForm = this.formBuilder.group({
      nom: [''],
      prenom: [''],
      email: ['']
    });
  }

  getFormation(id: string) {
    this.api.getFormation(id).subscribe(res => {
      this.formation = res;
    }, err => {
      console.error('Error loading formation:', err);
      this.formation = null;
    });
  }

  getSessions(formationId: string) {
    this.api.getSessionsByFormation(formationId).subscribe(res => {
      this.sessions = res || [];
      this.loadSessionsDetails();
    }, err => {
      console.error('Error loading sessions:', err);
      this.sessions = [];
    });
  }

  async loadSessionsDetails() {
    this.sessionsWithDetails = [];
    for (const session of this.sessions) {
      const sessionDetail: any = {
        session: session,
        formateurs: [] as Formateur[],
        inscriptionsCount: 0,
        isFull: false
      };

      // Charger les formateurs
      if (session.formateurIds && session.formateurIds.length > 0) {
        const formateurPromises = session.formateurIds.map(id => 
          firstValueFrom(this.api.getFormateur(id))
        );
        
        try {
          const formateurs = await Promise.all(formateurPromises);
          sessionDetail.formateurs = formateurs.filter(f => f !== undefined) as Formateur[];
        } catch (error) {
          console.error('Error loading formateurs:', error);
        }
      }

      // Compter les inscriptions
      this.api.getInscriptionsBySession(session.id).subscribe(inscriptions => {
        sessionDetail.inscriptionsCount = inscriptions ? inscriptions.length : 0;
        sessionDetail.isFull = sessionDetail.inscriptionsCount >= 15;
        this.sessionsWithDetails.push(sessionDetail);
      });
    }
  }

  async openInscriptionModal(sessionId: string) {
    this.selectedSessionId = sessionId;
    this.showInscriptionModal = true;
    this.inscriptionForm.reset();
    
    // Récupérer les formateurs de la session sélectionnée
    const sessionDetail = this.sessionsWithDetails.find(s => s.session.id === sessionId);
    if (sessionDetail && sessionDetail.formateurs) {
      this.selectedSessionFormateurs = sessionDetail.formateurs;
    } else {
      // Si les formateurs ne sont pas encore chargés, les charger
      const session = this.sessions.find(s => s.id === sessionId);
      if (session && session.formateurIds && session.formateurIds.length > 0) {
        try {
          const formateurPromises = session.formateurIds.map(id => 
            firstValueFrom(this.api.getFormateur(id))
          );
          const formateurs = await Promise.all(formateurPromises);
          this.selectedSessionFormateurs = formateurs.filter(f => f !== undefined) as Formateur[];
        } catch (error) {
          console.error('Error loading formateurs:', error);
          this.selectedSessionFormateurs = [];
        }
      } else {
        this.selectedSessionFormateurs = [];
      }
    }
  }

  closeInscriptionModal() {
    this.showInscriptionModal = false;
    this.inscriptionForm.reset();
  }

  submitInscription() {
    if (this.inscriptionForm.valid) {
      const inscription: Inscription = {
        id: '',
        sessionId: this.selectedSessionId,
        nom: this.inscriptionForm.value.nom,
        prenom: this.inscriptionForm.value.prenom,
        email: this.inscriptionForm.value.email
      };

      this.api.postInscription(inscription).subscribe(res => {
        alert('Inscription réussie ! ✅');
        this.closeInscriptionModal();
        // Recharger les sessions pour mettre à jour le nombre d'inscriptions
        if (this.formation) {
          this.getSessions(this.formation.id);
        }
      }, err => {
        alert('Erreur lors de l\'inscription');
      });
    }
  }

  downloadProgramme() {
    if (this.formation?.programme) {
      window.open(this.formation.programme, '_blank');
    }
  }
}

