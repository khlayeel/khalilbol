import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../shared/api.service';
import { Formateur } from '../../shared/formateur.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-formateurs',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './gestion-formateurs.component.html',
  styleUrl: './gestion-formateurs.component.css'
})
export class GestionFormateursComponent implements OnInit {
  formValue !: FormGroup;
  formateurModelObj: Formateur = new Formateur();
  formateurData !: any;
  filteredFormateurData: any[] = [];
  searchTerm: string = '';
  showAddButton: boolean = true;
  showModal: boolean = false;
  specialitesInput: string = '';

  constructor(private formbuilder: FormBuilder, private api: ApiService) { }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      nom: [''],
      prenom: [''],
      email: [''],
      telephone: [''],
      numeroCarteIdentite: [''],
      photo: [''],
      cv: [''],
      specialites: ['']
    })
    this.getAllFormateurs();
  }

  postFormateurDetails() {
    this.formateurModelObj.nom = this.formValue.value.nom;
    this.formateurModelObj.prenom = this.formValue.value.prenom;
    this.formateurModelObj.email = this.formValue.value.email;
    this.formateurModelObj.telephone = this.formValue.value.telephone;
    this.formateurModelObj.numeroCarteIdentite = this.formValue.value.numeroCarteIdentite;
    this.formateurModelObj.photo = this.formValue.value.photo;
    this.formateurModelObj.cv = this.formValue.value.cv;
    this.formateurModelObj.specialites = this.specialitesInput.split(',').map(s => s.trim()).filter(s => s);
    
    this.formateurModelObj.id = this.formateurModelObj.id || this.generateId();
    
    this.api.postFormateur(this.formateurModelObj).subscribe(res => {
      alert("Formateur ajouté avec succès! ✅")
      this.formValue.reset();
      this.specialitesInput = '';
      this.getAllFormateurs();
      this.showAddButton = true;
      this.showModal = false;
    }, err => {
      alert("Erreur lors de l'ajout");
    })
  }

  getAllFormateurs() {
    this.api.getAllFormateurs().subscribe(res => { 
      this.formateurData = res && res.length > 0 ? res.reverse() : [];
      this.filteredFormateurData = [...this.formateurData];
    })
  }

  deleteFormateur(row: any) {
    if(confirm('Êtes-vous sûr de vouloir supprimer ce formateur? 🗑️')) {
      const formateurId = row.id;
      if (!formateurId) {
        alert("Erreur: ID de formateur manquant");
        return;
      }
      this.api.deleteFormateur(formateurId)
        .subscribe(res => {
          alert("Formateur supprimé ✓");
          this.getAllFormateurs();
        }, err => {
          alert("Erreur lors de la suppression du formateur");
          console.error(err);
        })
    }
  }

  onEdit(row: any) {
    this.showAddButton = false;
    this.showModal = true;
    this.formateurModelObj.id = row.id;
    this.formValue.controls['nom'].setValue(row.nom);
    this.formValue.controls['prenom'].setValue(row.prenom);
    this.formValue.controls['email'].setValue(row.email);
    this.formValue.controls['telephone'].setValue(row.telephone);
    this.formValue.controls['numeroCarteIdentite'].setValue(row.numeroCarteIdentite);
    this.formValue.controls['photo'].setValue(row.photo);
    this.formValue.controls['cv'].setValue(row.cv);
    this.specialitesInput = row.specialites ? row.specialites.join(', ') : '';
  }

  updateFormateurDetails() {
    this.formateurModelObj.nom = this.formValue.value.nom;
    this.formateurModelObj.prenom = this.formValue.value.prenom;
    this.formateurModelObj.email = this.formValue.value.email;
    this.formateurModelObj.telephone = this.formValue.value.telephone;
    this.formateurModelObj.numeroCarteIdentite = this.formValue.value.numeroCarteIdentite;
    this.formateurModelObj.photo = this.formValue.value.photo;
    this.formateurModelObj.cv = this.formValue.value.cv;
    this.formateurModelObj.specialites = this.specialitesInput.split(',').map(s => s.trim()).filter(s => s);
    
    this.api.updateFormateur(this.formateurModelObj, this.formateurModelObj.id)
      .subscribe(res => {
        alert("Formateur modifié avec succès! ✨");
        this.getAllFormateurs();
        this.showAddButton = true;
        this.formValue.reset();
        this.specialitesInput = '';
        this.showModal = false;
      })
  }

  filterFormateurs() {
    const term = this.searchTerm.toLowerCase();
    this.filteredFormateurData = this.formateurData.filter((formateur: any) => {
      return (
        (formateur.nom && formateur.nom.toLowerCase().includes(term)) ||
        (formateur.prenom && formateur.prenom.toLowerCase().includes(term)) ||
        (formateur.email && formateur.email.toLowerCase().includes(term))
      );
    });
  }

  clickAddFormateur() {
    this.formValue.reset();
    this.specialitesInput = '';
    this.showAddButton = true;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.formValue.reset();
    this.specialitesInput = '';
    this.showAddButton = true;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}



