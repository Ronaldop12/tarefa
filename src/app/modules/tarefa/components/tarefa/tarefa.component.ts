import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';
import { TarefaService } from 'src/app/modules/shared/services/tarefa.service';
import { NewTarefaComponent } from '../new-tarefa/new-tarefa.component';
import { ChangeDetectorRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgZone } from '@angular/core';


@Component({
  selector: 'app-tarefa',
  templateUrl: './tarefa.component.html',
  styleUrls: ['./tarefa.component.css']
})
export class TarefaComponent implements OnInit {

  constructor(
    private tarefaService: TarefaService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) { }

  displayedColumns: string[] = ['id', 'nome', 'custo', 'dataLimite', 'actions'];
  dataSource = new MatTableDataSource<TarefaElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngOnInit(): void {
    this.getTarefas();
  }

  getTarefas(): void {
    this.tarefaService.getTarefas()
      .subscribe((data: any) => {
        console.log("Resposta tarefas: ", data);
        this.processTarefasResponse(data);
      }, (error: any) => {
        console.log("erro: ", error);
      });
  }

  processTarefasResponse(resp: any) {
    console.log(resp); // Ver a resposta completa

    const dataTarefa: TarefaElement[] = [];

    // Ajustando para a estrutura correta da resposta
    if (resp && resp.content) {
      let listTarefa = resp.content;
      console.log(listTarefa); // Ver a lista de tarefas extraída

      // Ordena as tarefas pelo campo "Ordem de apresentação"
      listTarefa.sort((a: TarefaElement, b: TarefaElement) => a.ordemApresentacao - b.ordemApresentacao);

      listTarefa.forEach((element: TarefaElement) => {
        dataTarefa.push(element);
      });

      this.dataSource.data = dataTarefa; // Atualiza diretamente o dataSource
      this.dataSource.paginator = this.paginator;
      this.dataSource.filter = '';
      this.dataSource._updateChangeSubscription();
    }
  }



  openTarefaDialog() {
    const dialogRef = this.dialog.open(NewTarefaComponent, {
      width: '450px'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar("Tarefa Adicionada", "Com Sucesso!!!");
        this.getTarefas();
      } else if (result == 2) {
        this.openSnackBar("Erro ao salvar tarefa", "Erro");
      } else if (result == 3) {
        this.openSnackBar("Nome da tarefa já existe!", "Erro");
      }
    });
  }

  editar(id: number, nome: string, custo: number, dataLimite: Date) {
    const dialogRef = this.dialog.open(NewTarefaComponent, {
      width: '450px',
      data: { id: id, nome: nome, custo: custo, dataLimite: dataLimite }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar("Tarefa Atualizada", "Com sucesso!!!");
        this.getTarefas();
      } else if (result == 2) {
        this.openSnackBar("Erro ao atualizar tarefa", "Erro");
      } else if (result == 3) {
        this.openSnackBar("Nome da tarefa já existe!", "Erro");
      }
      this.zone.run(() => this.getTarefas());
    });
  }


  excluir(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: { id: id, module: "tarefa" }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar("Tarefa Excluída", "Sucesso");
        this.getTarefas();
      } else if (result == 2) {
        this.openSnackBar("Erro ao excluir uma tarefa", "Erro");
      }
    });
  }



  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 6000,
      verticalPosition: 'top',  // Aqui está a propriedade para ajustar a posição vertical.
      horizontalPosition: 'center' // E esta ajusta a posição horizontal, se desejado.
    });
  }

  moveUp(element: TarefaElement): void {
    const index = this.dataSource.data.indexOf(element);
    if (index > 0) {
      const temp = this.dataSource.data[index];
      this.dataSource.data[index] = this.dataSource.data[index - 1];
      this.dataSource.data[index - 1] = temp;

      // Atualize a ordem de apresentação
      this.dataSource.data[index].ordemApresentacao = index;
      this.dataSource.data[index - 1].ordemApresentacao = index - 1;

      this.refreshTable();
    }
  }

  moveDown(element: TarefaElement): void {
    const index = this.dataSource.data.indexOf(element);
    if (index < this.dataSource.data.length - 1) {
      const temp = this.dataSource.data[index];
      this.dataSource.data[index] = this.dataSource.data[index + 1];
      this.dataSource.data[index + 1] = temp;

      // Atualize a ordem de apresentação
      this.dataSource.data[index].ordemApresentacao = index;
      this.dataSource.data[index + 1].ordemApresentacao = index + 1;

      this.refreshTable();
    }
  }

  refreshTable() {
    this.dataSource._updateChangeSubscription();

  }


  drop(event: CdkDragDrop<TarefaElement[]>): void {
    moveItemInArray(this.dataSource.data, event.previousIndex, event.currentIndex);
    this.refreshTable();
  }
 
  buscar(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
  }
  

}


export interface TarefaElement {
  id: number;
  nome: string;
  custo: number;
  dataLimite: Date;
  ordemApresentacao: number;
}

