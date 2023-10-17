import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { TarefaComponent } from './components/tarefa/tarefa.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewTarefaComponent } from './components/new-tarefa/new-tarefa.component';

@NgModule({
  declarations: [
    TarefaComponent,
    NewTarefaComponent
  ],
  imports: [
    CommonModule,  // Importado para usar o CurrencyPipe no template
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    CurrencyPipe  // Adicionado aos providers para usar no componente ou serviço
  ]
})
export class TarefaModule { }
