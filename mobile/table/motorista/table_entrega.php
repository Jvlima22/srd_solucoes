<?php
require_once '../../../controllers/ordenacao.php';

class EntregaListar extends Ordenacao
{

    public function listar()
    {
        $start = $_REQUEST['start'];
        $length = $_REQUEST['length'];

        $dados = $this->dados($start, $length);

        $data = [
            "draw" => $_REQUEST['draw'],
            "recordsTotal" => intval($dados['total']),
            "recordsFiltered" => intval($dados['total']),
            "data" => []
        ];

        while ($row = mysqli_fetch_object($dados['data'])) {
            $data['data'][] = [
                'id' => $row->id,
                'id_ocorrencia' => $row->id_ocorrencia,
                'id_manifesto' => $row->id_manifesto,
                'id_motorista' => $row->id_motorista,
                'nome_ocorrencia' => $row->nome_ocorrencia,
                'data_ocorrencia' => date('d/m/Y', strtotime($row->data_ocorrencia)),
                'hora_ocorrencia' => date('H:i', strtotime($row->hora_ocorrencia)),
				'perfil_usuario' => $_SESSION['usuarioPerfil']
            ];
        }

        echo json_encode($data);
    }

    private function dados($start, $length)
    {
        global $conn;

        $order = $this->getOrdenation((object)$_REQUEST);

        $sb = new StringBuilder();
        $sb->append("SELECT");
        $sb->append("ocorrencia_movimento.id,");
        $sb->append("ocorrencia_movimento.id_manifesto,");
        $sb->append("ocorrencia_movimento.id_motorista,");
        $sb->append("ocorrencia_movimento.id_ocorrencia,");
        $sb->append("ocorrencia.nome as nome_ocorrencia,");
        $sb->append("ocorrencia_movimento.data_ocorrencia,");
        $sb->append("ocorrencia_movimento.hora_ocorrencia");
        $sb->append("FROM");
        $sb->append("ocorrencia_movimento");
        $sb->append("LEFT JOIN ocorrencia");
        $sb->append("ON ocorrencia.id = ocorrencia_movimento.id_ocorrencia");
        
        $sb->append("WHERE");
        $sb->append($this->filtros());
        $sb->append("ORDER BY ocorrencia_movimento.data_ocorrencia DESC, ocorrencia_movimento.hora_ocorrencia DESC");
        $dados = mysqli_query($conn, $sb->toString());

        $sb = new StringBuilder();
        $sb->append("SELECT");
        $sb->append("count(1) AS total");
        $sb->append("FROM");
        $sb->append("ocorrencia_movimento");
        $sb->append("WHERE");
        $sb->append($this->filtros());
        $totais = mysqli_fetch_object(mysqli_query($conn, $sb->toString()));

        return [
            "data" => $dados,
            "total" => $totais->total
        ];
    }

    private function filtros()
    {
        $sb = new StringBuilder();
        $sb->append("ocorrencia_movimento.id_documento = '{$_REQUEST['id_documento']}' and ocorrencia_movimento.id_tipo_movimento != 3 and ocorrencia_movimento.status != 10");
        return $sb->toString();
    }

    public function detalhe()
    {
        global $conn;

        $sb = new StringBuilder();
        $sb->append("SELECT");
        $sb->append("ocorrencia_movimento.id,");
        $sb->append("ocorrencia_movimento.id_ocorrencia,");
        $sb->append("frete_documento.numero as numero_documento,");
        $sb->append("frete_documento.id_frete,");
        $sb->append("ocorrencia.nome as nome_ocorrencia,");
        $sb->append("ocorrencia_movimento.data_ocorrencia,");
        $sb->append("ocorrencia_movimento.hora_ocorrencia,");
        $sb->append("ocorrencia_movimento.id_manifesto,");
        $sb->append("ocorrencia_movimento.id_motorista,");
        $sb->append("ocorrencia_movimento.id_tipo_movimento,");
        $sb->append("ocorrencia.informar_recebedor,");
        $sb->append("ocorrencia.comprovante,");
        $sb->append("ocorrencia_movimento.id_documento");
        
        $sb->append("FROM");
        $sb->append("ocorrencia_movimento");

        $sb->append("LEFT JOIN frete_documento");
        $sb->append("ON frete_documento.id = ocorrencia_movimento.id_documento");

        $sb->append("LEFT JOIN ocorrencia");
        $sb->append("ON ocorrencia.id = ocorrencia_movimento.id_ocorrencia");

        $sb->append("WHERE ocorrencia_movimento.id = '{$_REQUEST['id']}'");
        $dados = mysqli_fetch_object(mysqli_query($conn, $sb->toString()));
        $dados->dt_cadastro = date('d/m/Y H:i', strtotime($dados->dt_cadastro));
        $dados->dt_modificacao = date('d/m/Y H:i', strtotime($dados->dt_modificacao));


        echo json_encode([
            'data' => $dados
        ]);
    }
}

new EntregaListar();