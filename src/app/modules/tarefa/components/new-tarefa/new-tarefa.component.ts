import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TarefaService } from 'src/app/modules/shared/services/tarefa.service';
import { DialogCloseReasons } from 'src/app/enum/dialog-close-reasons.enum'
import { DecimalPipe } from '@angular/common';

interface TarefaData {
  nome: string;
  custo: number;
  dataLimite: Date;
  id?: number; // Adicionando uma opção para um ID
};

@Component({
  selector: 'app-new-tarefa',
  templateUrl: './new-tarefa.component.html',
  styleUrls: ['./new-tarefa.component.css'],
  providers: [DecimalPipe]
   
})

export class NewTarefaComponent implements OnInit {

  tarefaForm!: FormGroup;
  data: TarefaData | null = null;
  estadoFormulario: string = "Inserir";

  constructor(
    private fb: FormBuilder,
    private tarefaService: TarefaService,
    private dialogRef: MatDialogRef<NewTarefaComponent>,
    @Inject(MAT_DIALOG_DATA) public injectedData: TarefaData | null,
    private decimalPipe: DecimalPipe
    
  ) {
    this.data = injectedData;
  }

  ngOnInit(): void {
    console.log(this.data);

    this.initializeForm(this.data);
    
    if (this.data) {
      this.estadoFormulario = "Atualizar";
    }
  }

  get isFormValid(): boolean {
    return this.tarefaForm.valid;
  }

  initializeForm(data: TarefaData | null): void {
    this.tarefaForm = this.fb.group({
      nome: [data?.nome || '', Validators.required],
      custo: [data?.custo || '', [Validators.required, Validators.min(0)]],
      dataLimite: [data?.dataLimite || '', Validators.required]
    });
  }

  formatarCusto(): void {
    let valor = this.tarefaForm.get('custo')?.value;
    if (valor && !isNaN(valor)) {
      valor = parseFloat(valor);
      this.tarefaForm.get('custo')?.setValue(this.decimalPipe.transform(valor, '1.2-2'));
    }
  }

  desformatarCusto(): void {
    let valor = this.tarefaForm.get('custo')?.value;
    if (valor) {
      this.tarefaForm.get('custo')?.setValue(valor.replace(/[.,]/g, '').replace('R$', ''));
    }
  }

  onSave(): void {
    if (this.tarefaForm.valid) {
      const { nome, custo, dataLimite } = this.tarefaForm.value;

      const tarefaData: TarefaData = { nome, custo, dataLimite };

      if (this.data && this.data.nome === nome) {
        this.updateTarefa(tarefaData);
      } else {
        this.checkAndProceed(tarefaData);
      }
    }
  }

  checkAndProceed(data: TarefaData): void {
    this.tarefaService.checkIfNameExists(data.nome, this.data?.id || null).subscribe(response => {
        if (response.exists) {
            this.dialogRef.close(DialogCloseReasons.NameExists);
        } else {
            this.data ? this.updateTarefa(data) : this.createTarefa(data);
        }
    }, () => {
        this.dialogRef.close(DialogCloseReasons.Error);
    });
  }
  
  createTarefa(data: TarefaData): void {
    this.tarefaService.saveTarefa(data).subscribe(() => {
        this.dialogRef.close(DialogCloseReasons.Success);
    }, () => {
        this.dialogRef.close(DialogCloseReasons.Error);
    });
  }
  
  updateTarefa(data: TarefaData): void {
    this.tarefaService.updateTarefa(data, this.data!.id!).subscribe(() => {
        this.dialogRef.close(DialogCloseReasons.Success);
    }, () => {
        this.dialogRef.close(DialogCloseReasons.Error);
    });
  }
  
  onCancel(): void {
    this.dialogRef.close(DialogCloseReasons.Cancelled);
  }

  

}
