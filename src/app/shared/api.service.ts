import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Formateur } from './formateur.model';
import { Formation } from './formation.model';
import { Candidat } from './candidat.model';
import { Session } from './session.model';
import { Categorie } from './categorie.model';
import { Inscription } from './inscription.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Storage keys
  private readonly STORAGE_KEYS = {
    FORMATEURS: 'formateurs',
    FORMATIONS: 'formations',
    CANDIDATS: 'candidats',
    SESSIONS: 'sessions',
    CATEGORIES: 'categories',
    INSCRIPTIONS: 'inscriptions'
  };

  constructor() {
    this.initializeStorage();
  }

  // Initialize localStorage with empty arrays if they don't exist
  private initializeStorage(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
      }
    });
  }

  // Generic helper methods
  private getItems<T>(key: string): T[] {
    const items = localStorage.getItem(key);
    return items ? JSON.parse(items) : [];
  }

  private setItems<T>(key: string, items: T[]): void {
    localStorage.setItem(key, JSON.stringify(items));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Formateurs
  postFormateur(data: Formateur): Observable<Formateur> {
    const formateurs = this.getItems<Formateur>(this.STORAGE_KEYS.FORMATEURS);
    const newFormateur = { ...data, id: data.id || this.generateId() };
    formateurs.push(newFormateur);
    this.setItems(this.STORAGE_KEYS.FORMATEURS, formateurs);
    return of(newFormateur).pipe(delay(100));
  }

  getAllFormateurs(): Observable<Formateur[]> {
    const formateurs = this.getItems<Formateur>(this.STORAGE_KEYS.FORMATEURS);
    return of(formateurs).pipe(delay(100));
  }

  getFormateur(id: string): Observable<Formateur> {
    const formateurs = this.getItems<Formateur>(this.STORAGE_KEYS.FORMATEURS);
    const formateur = formateurs.find(f => f.id === id);
    if (!formateur) {
      throw new Error(`Formateur with id ${id} not found`);
    }
    return of(formateur).pipe(delay(100));
  }

  deleteFormateur(id: string): Observable<any> {
    if (!id) {
      throw new Error('ID de formateur manquant');
    }
    const formateurs = this.getItems<Formateur>(this.STORAGE_KEYS.FORMATEURS);
    const initialLength = formateurs.length;
    const filtered = formateurs.filter(f => {
      // Comparaison stricte pour éviter les problèmes de type
      return String(f.id) !== String(id);
    });
    
    if (filtered.length === initialLength) {
      console.warn(`Formateur avec l'ID ${id} non trouvé`);
    }
    
    this.setItems(this.STORAGE_KEYS.FORMATEURS, filtered);
    return of({ success: true }).pipe(delay(100));
  }

  updateFormateur(data: Formateur, id: string): Observable<Formateur> {
    const formateurs = this.getItems<Formateur>(this.STORAGE_KEYS.FORMATEURS);
    const index = formateurs.findIndex(f => f.id === id);
    if (index === -1) {
      throw new Error(`Formateur with id ${id} not found`);
    }
    formateurs[index] = { ...data, id };
    this.setItems(this.STORAGE_KEYS.FORMATEURS, formateurs);
    return of(formateurs[index]).pipe(delay(100));
  }

  // Formations
  postFormation(data: Formation): Observable<Formation> {
    const formations = this.getItems<Formation>(this.STORAGE_KEYS.FORMATIONS);
    const newFormation = { ...data, id: data.id || this.generateId() };
    formations.push(newFormation);
    this.setItems(this.STORAGE_KEYS.FORMATIONS, formations);
    return of(newFormation).pipe(delay(100));
  }

  getAllFormations(): Observable<Formation[]> {
    const formations = this.getItems<Formation>(this.STORAGE_KEYS.FORMATIONS);
    return of(formations).pipe(delay(100));
  }

  getFormation(id: string): Observable<Formation> {
    const formations = this.getItems<Formation>(this.STORAGE_KEYS.FORMATIONS);
    const formation = formations.find(f => f.id === id);
    if (!formation) {
      throw new Error(`Formation with id ${id} not found`);
    }
    return of(formation).pipe(delay(100));
  }

  deleteFormation(id: string): Observable<any> {
    const formations = this.getItems<Formation>(this.STORAGE_KEYS.FORMATIONS);
    const filtered = formations.filter(f => f.id !== id);
    this.setItems(this.STORAGE_KEYS.FORMATIONS, filtered);
    return of({ success: true }).pipe(delay(100));
  }

  updateFormation(data: Formation, id: string): Observable<Formation> {
    const formations = this.getItems<Formation>(this.STORAGE_KEYS.FORMATIONS);
    const index = formations.findIndex(f => f.id === id);
    if (index === -1) {
      throw new Error(`Formation with id ${id} not found`);
    }
    formations[index] = { ...data, id };
    this.setItems(this.STORAGE_KEYS.FORMATIONS, formations);
    return of(formations[index]).pipe(delay(100));
  }

  // Candidats
  postCandidat(data: Candidat): Observable<Candidat> {
    const candidats = this.getItems<Candidat>(this.STORAGE_KEYS.CANDIDATS);
    const newCandidat = { ...data, id: data.id || this.generateId() };
    candidats.push(newCandidat);
    this.setItems(this.STORAGE_KEYS.CANDIDATS, candidats);
    return of(newCandidat).pipe(delay(100));
  }

  getAllCandidats(): Observable<Candidat[]> {
    const candidats = this.getItems<Candidat>(this.STORAGE_KEYS.CANDIDATS);
    return of(candidats).pipe(delay(100));
  }

  getCandidat(id: string): Observable<Candidat> {
    const candidats = this.getItems<Candidat>(this.STORAGE_KEYS.CANDIDATS);
    const candidat = candidats.find(c => c.id === id);
    if (!candidat) {
      throw new Error(`Candidat with id ${id} not found`);
    }
    return of(candidat).pipe(delay(100));
  }

  deleteCandidat(id: string): Observable<any> {
    const candidats = this.getItems<Candidat>(this.STORAGE_KEYS.CANDIDATS);
    const filtered = candidats.filter(c => c.id !== id);
    this.setItems(this.STORAGE_KEYS.CANDIDATS, filtered);
    return of({ success: true }).pipe(delay(100));
  }

  updateCandidat(data: Candidat, id: string): Observable<Candidat> {
    const candidats = this.getItems<Candidat>(this.STORAGE_KEYS.CANDIDATS);
    const index = candidats.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Candidat with id ${id} not found`);
    }
    candidats[index] = { ...data, id };
    this.setItems(this.STORAGE_KEYS.CANDIDATS, candidats);
    return of(candidats[index]).pipe(delay(100));
  }

  // Sessions
  postSession(data: Session): Observable<Session> {
    const sessions = this.getItems<Session>(this.STORAGE_KEYS.SESSIONS);
    const newSession = { ...data, id: data.id || this.generateId() };
    sessions.push(newSession);
    this.setItems(this.STORAGE_KEYS.SESSIONS, sessions);
    return of(newSession).pipe(delay(100));
  }

  getAllSessions(): Observable<Session[]> {
    const sessions = this.getItems<Session>(this.STORAGE_KEYS.SESSIONS);
    return of(sessions).pipe(delay(100));
  }

  getSession(id: string): Observable<Session> {
    const sessions = this.getItems<Session>(this.STORAGE_KEYS.SESSIONS);
    const session = sessions.find(s => s.id === id);
    if (!session) {
      throw new Error(`Session with id ${id} not found`);
    }
    return of(session).pipe(delay(100));
  }

  getSessionsByFormation(formationId: string): Observable<Session[]> {
    const sessions = this.getItems<Session>(this.STORAGE_KEYS.SESSIONS);
    const filtered = sessions.filter(s => s.formationId === formationId);
    return of(filtered).pipe(delay(100));
  }

  deleteSession(id: string): Observable<any> {
    const sessions = this.getItems<Session>(this.STORAGE_KEYS.SESSIONS);
    const filtered = sessions.filter(s => s.id !== id);
    this.setItems(this.STORAGE_KEYS.SESSIONS, filtered);
    return of({ success: true }).pipe(delay(100));
  }

  updateSession(data: Session, id: string): Observable<Session> {
    const sessions = this.getItems<Session>(this.STORAGE_KEYS.SESSIONS);
    const index = sessions.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Session with id ${id} not found`);
    }
    sessions[index] = { ...data, id };
    this.setItems(this.STORAGE_KEYS.SESSIONS, sessions);
    return of(sessions[index]).pipe(delay(100));
  }

  // Categories
  postCategorie(data: Categorie): Observable<Categorie> {
    const categories = this.getItems<Categorie>(this.STORAGE_KEYS.CATEGORIES);
    const newCategorie = { ...data, id: data.id || this.generateId() };
    categories.push(newCategorie);
    this.setItems(this.STORAGE_KEYS.CATEGORIES, categories);
    return of(newCategorie).pipe(delay(100));
  }

  getAllCategories(): Observable<Categorie[]> {
    const categories = this.getItems<Categorie>(this.STORAGE_KEYS.CATEGORIES);
    return of(categories).pipe(delay(100));
  }

  getCategorie(id: string): Observable<Categorie> {
    const categories = this.getItems<Categorie>(this.STORAGE_KEYS.CATEGORIES);
    const categorie = categories.find(c => c.id === id);
    if (!categorie) {
      throw new Error(`Categorie with id ${id} not found`);
    }
    return of(categorie).pipe(delay(100));
  }

  deleteCategorie(id: string): Observable<any> {
    if (!id) {
      throw new Error('ID de catégorie manquant');
    }
    const categories = this.getItems<Categorie>(this.STORAGE_KEYS.CATEGORIES);
    const initialLength = categories.length;
    const filtered = categories.filter(c => {
      // Comparaison stricte pour éviter les problèmes de type
      return String(c.id) !== String(id);
    });
    
    if (filtered.length === initialLength) {
      console.warn(`Catégorie avec l'ID ${id} non trouvée`);
    }
    
    this.setItems(this.STORAGE_KEYS.CATEGORIES, filtered);
    return of({ success: true }).pipe(delay(100));
  }

  updateCategorie(data: Categorie, id: string): Observable<Categorie> {
    const categories = this.getItems<Categorie>(this.STORAGE_KEYS.CATEGORIES);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Categorie with id ${id} not found`);
    }
    categories[index] = { ...data, id };
    this.setItems(this.STORAGE_KEYS.CATEGORIES, categories);
    return of(categories[index]).pipe(delay(100));
  }

  // Inscriptions
  postInscription(data: Inscription): Observable<Inscription> {
    const inscriptions = this.getItems<Inscription>(this.STORAGE_KEYS.INSCRIPTIONS);
    const newInscription = { ...data, id: data.id || this.generateId() };
    inscriptions.push(newInscription);
    this.setItems(this.STORAGE_KEYS.INSCRIPTIONS, inscriptions);
    return of(newInscription).pipe(delay(100));
  }

  getInscriptionsBySession(sessionId: string): Observable<Inscription[]> {
    const inscriptions = this.getItems<Inscription>(this.STORAGE_KEYS.INSCRIPTIONS);
    const filtered = inscriptions.filter(i => i.sessionId === sessionId);
    return of(filtered).pipe(delay(100));
  }
}

