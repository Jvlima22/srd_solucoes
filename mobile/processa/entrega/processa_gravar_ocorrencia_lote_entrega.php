<?php
include_once("../../../conectar.php");

require_once SISTEMA_ROOT . '../lib/SistemaSrp/HistoricoMovimento/HistoricoMovimento.php';
require_once SISTEMA_ROOT . '../lib/SistemaSrp/Comprovante/Comprovante.php';
require_once SISTEMA_ROOT . '../WideImage/WideImage.php';

include_once("../../../includes/Sql.php");
set_time_limit(10000);


$id_motorista = $_POST["id_motorista"];
$id_tipo_movimento = $_POST["id_tipo_movimento"];

$id_ocorrencia = $_POST["id_ocorrencia"];
$tipo_acao = $_POST["tipo_acao"];
$informar_recebedor = $_POST["informar_recebedor"];
$comprovante = $_POST["comprovante"];

$data_ocorrencia = $_POST["data_ocorrencia"];
$hora_ocorrencia = $_POST["hora_ocorrencia"];
$observacao = $_POST["observacao"];


$recebedor = trim($_POST["recebedor"]);
$recebedor = str_replace(
    ["'", 'á', 'à', 'ã', 'â', 'é', 'ê', 'í', 'ó', 'ô', 'õ', 'ú', 'ü', 'Á', 'À', 'Ã', 'Â', 'É', 'Ê', 'Í', 'Ó', 'Ô', 'Õ', 'Ú', 'Ü'],
    ["", 'a', 'a', 'a', 'a', 'e', 'e', 'i', 'o', 'o', 'o', 'u', 'u', 'A', 'A', 'A', 'A', 'E', 'E', 'I', 'O', 'O', 'O', 'U', 'U'],
    $recebedor);
$recebedor = strtolower($recebedor);
$recebedor = ucfirst($recebedor);
$documento_recebedor = trim($_POST["documento_recebedor"]);
$id_tipo_recebedor = $_POST["id_tipo_recebedor"];

$arquivos = $_FILES['files'];

$formato_data = "Y-m-d";
$id_usuario = $_SESSION['usuarioId'];
$dt_cadastro = date("Y-m-d H:i:s");

$data_historico = date("Y-m-d");
$hora_historico = date("H:i:s");

$sql = new Sql($conn);
$sql->startTransaction();

try {

    if (empty($id_motorista)) {
        throw new Exception('Erro campo id_motorista, acione o suporte');
    }

    if (empty($id_tipo_movimento)) {
        throw new Exception('Erro campo id_tipo_movimento, acione o suporte');
    }

    if (empty($id_ocorrencia)) {
        throw new Exception('Erro campo id_ocorrencia, acione o suporte');
    }

    if (empty($tipo_acao)) {
        throw new Exception('Erro campo tipo_acao, acione o suporte');
    }

    if (empty($informar_recebedor)) {
        throw new Exception('Erro campo informar_recebedor, acione o suporte');
    }

    if (empty($comprovante)) {
        throw new Exception('Erro campo comprovante, acione o suporte');
    }

    if (empty($data_ocorrencia)) {
        throw new Exception('Informe a Data Ocorrência');
    }

    $date = DateTime::createFromFormat($formato_data, $data_ocorrencia);
    if ($date && $date->format($formato_data) == $data_ocorrencia) {
    } else {
        throw new Exception('Data Solicitação Invalida .');
    }

    if (empty($hora_ocorrencia)) {
        throw new Exception('Informe a Hora Ocorrência');
    }


    $pesquisar = sprintf("SELECT id, id_frete FROM frete_documento WHERE id IN (%s) ", $_REQUEST['id_documento']);
    $resultado_pesquisa = mysqli_query($conn, $pesquisar);

    $documentos = [];
    while ($resultado = mysqli_fetch_assoc($resultado_pesquisa)) {
        $documentos[] = $resultado;
    }
    if (count($documentos) == 0) {
        throw new \Exception("Documento Não Localizado.");
    }

    foreach ($documentos as $resultado) {
        $id_documento = $resultado['id'];
        $id_frete = $resultado['id_frete'];

        if (empty($id_documento)) {
            throw new Exception('Erro campo id_documento, acione o suporte');
        }

        if (empty($id_frete)) {
            throw new Exception('Erro campo id_frete, acione o suporte');
        }


        $verify_frete = mysqli_query($conn, "SELECT
	frete_documento.id,
	frete_documento.numero,
	status_movimento.nome as nome_status
	FROM frete_documento 
	LEFT JOIN status_movimento ON status_movimento.id = frete_documento.tipo_acao
	WHERE frete_documento.id = '{$id_documento}' and 
	(frete_documento.tipo_acao = 7 or frete_documento.tipo_acao = 8 or frete_documento.tipo_acao = 9 or frete_documento.tipo_acao = 10 or frete_documento.tipo_acao = 12) ");
        $resultado = mysqli_fetch_assoc($verify_frete);
        if ($verify_frete->num_rows > 0) {
            throw new Exception("Ação Não Permitida - Documento N° {$resultado['numero']} Possue Status {$resultado['nome_status']}");
        }

        $pesquisar_data = "SELECT 
	data_ocorrencia, 
	hora_ocorrencia  
	FROM ocorrencia_movimento 
	WHERE id_documento = '" . $id_documento . "' and id_movimento  = '{$id_frete}' AND id_tipo_movimento != 3 and status != 10 ORDER BY id DESC";
        $resultado_data = mysqli_query($conn, $pesquisar_data);
        $data = mysqli_fetch_assoc($resultado_data);

        $data_hora = $data['data_ocorrencia'] . ' ' . $data['hora_ocorrencia'];
        $data_hora = date('Y-m-d H:i', strtotime($data_hora));

        $data_hora = strtotime($data_hora);
        $data_hora_ocorrencia = $_REQUEST["data_ocorrencia"] . ' ' . $_REQUEST["hora_ocorrencia"];
        $data_hora_ocorrencia = strtotime($data_hora_ocorrencia);


        if ($data_hora_ocorrencia < $data_hora) {
            throw new Exception('Data da Ocorrência Menor que Data da Ultima Ocorrência');
        }

        $query_01 = "INSERT INTO ocorrencia_movimento (
id_movimento,
id_tipo_movimento,
id_documento,
id_ocorrencia,
tipo_acao,
data_ocorrencia,
hora_ocorrencia,
id_motorista,
observacao,
id_usuario,
dt_cadastro) VALUES (
'$id_frete',
'$id_tipo_movimento',
'$id_documento',
'$id_ocorrencia',
'$tipo_acao',
'$data_ocorrencia',
'$hora_ocorrencia',
'$id_motorista',
'$observacao',
'$id_usuario',
'$dt_cadastro')";
        $sql->query($query_01);
        $id_ocorrencia_movimento = $conn->insert_id;

        if (empty($id_ocorrencia_movimento)) {
            throw new Exception('Erro campo id_ocorrencia_movimento, acione o suporte');
        }

        $query_02 = "UPDATE frete_documento set 
tipo_acao ='$tipo_acao',
id_ocorrencia ='$id_ocorrencia' WHERE id='$id_documento'";
        $sql->query($query_02);

        if ($informar_recebedor < 2) {
            $query_03 = "UPDATE frete_documento set 
recebedor ='$recebedor',
documento_recebedor ='$documento_recebedor',
id_tipo_recebedor ='$id_tipo_recebedor' WHERE id='$id_documento'";
            $sql->query($query_03);
        }


        if ($comprovante == 1) {
            for ($i = 0; $i < count($arquivos['tmp_name']); $i++) {
                $nome_arquivo = $_POST['id_tipo_movimento'] . '-' . $id_ocorrencia_movimento . '-' . ($i + 1) . '-' . rand(1, 999999);

                // Faz o upload da imagem
                $img = \WideImage::loadFromUpload('files', $i);
                $nome_final = $nome_arquivo . '.jpg';
                $nome_final_pequeno = $nome_arquivo . '-reduzido.jpg';
                $caminho_final = COMPROVANTES_DIR . $nome_final;
                $caminho_final_pequeno = COMPROVANTES_DIR . $nome_final_pequeno;
                $pequeno = $img->resize(411, 274);
                $grande = $img->resize(1000, 800);

                if (!is_dir(COMPROVANTES_DIR)) {
                    mkdir(COMPROVANTES_DIR);
                }

                // Se imagem já existir remove-a antes de gravar novamente
                if (file_exists($caminho_final_pequeno)) {
                    unlink($caminho_final_pequeno);
                }

                if (file_exists($caminho_final)) {
                    unlink($caminho_final);
                }

                $pequeno->saveToFile($caminho_final_pequeno);
                $grande->saveToFile($caminho_final);

                // Verificar se é possivel mover o arquivo para a pasta escolhida
                if (file_exists($caminho_final)) {
                    $dados = [
                        'id_movimento' => $id_ocorrencia_movimento,
                        'id_tipo_movimento' => $id_tipo_movimento,
                        'arquivo' => $nome_final,
                        'id_usuario' => $id_usuario,
                        'dt_cadastro' => $dt_cadastro
                    ];

                    // Busca comprovantes anteriores e os exclui antes de prosseguir
                    $comprovante_anterior = \SistemaSrp\Comprovante\Comprovante::getComprovantePorArquivo($conn, $nome_final);
                    if ($comprovante_anterior instanceof \SistemaSrp\Comprovante\Comprovante) {
                        $comprovante_anterior->exclui($conn);
                    }

                    $comprovante = new \SistemaSrp\Comprovante\Comprovante();
                    $comprovante->salva($conn, $dados);
                }
            }

            $query_01 = "UPDATE ocorrencia_movimento set 
	comprovante  ='1' WHERE id ='$id_ocorrencia_movimento'";
            $sql->query($query_01);
        }

        $pesquisar_tratativa = "SELECT tipo_acao FROM frete_documento WHERE id_frete = '" . $id_frete . "' and tipo_acao = 12 ";
        $resultado_tratativa = mysqli_query($conn, $pesquisar_tratativa);
        $tratativa = mysqli_fetch_assoc($resultado_tratativa);
        $tratativa = $tratativa['tipo_acao'];

        $pesquisar_pendente = "SELECT tipo_acao FROM frete_documento WHERE id_frete = '" . $id_frete . "' and tipo_acao = 6 ";
        $resultado_pendente = mysqli_query($conn, $pesquisar_pendente);
        $pendente = mysqli_fetch_assoc($resultado_pendente);
        $pendente = $pendente['tipo_acao'];

        $pesquisar_transito = "SELECT tipo_acao FROM frete_documento WHERE id_frete = '" . $id_frete . "' and tipo_acao = 4 ";
        $resultado_transito = mysqli_query($conn, $pesquisar_transito);
        $transito = mysqli_fetch_assoc($resultado_transito);
        $transito = $transito['tipo_acao'];

        $pesquisar_aberto = "SELECT tipo_acao FROM frete_documento WHERE id_frete = '" . $id_frete . "' and tipo_acao = 1 ";
        $resultado_aberto = mysqli_query($conn, $pesquisar_aberto);
        $aberto = mysqli_fetch_assoc($resultado_aberto);
        $aberto = $aberto['tipo_acao'];

        $pesquisar_entregue = "SELECT tipo_acao FROM frete_documento WHERE id_frete = '" . $id_frete . "' and tipo_acao = 9 ";
        $resultado_entregue = mysqli_query($conn, $pesquisar_entregue);
        $entregue = mysqli_fetch_assoc($resultado_entregue);
        $entregue = $entregue['tipo_acao'];

        $pesquisar_finalizado = "SELECT tipo_acao FROM frete_documento WHERE id_frete = '" . $id_frete . "' and tipo_acao = 8 ";
        $resultado_finalizado = mysqli_query($conn, $pesquisar_finalizado);
        $finalizado = mysqli_fetch_assoc($resultado_finalizado);
        $finalizado = $finalizado['tipo_acao'];

        if ($tratativa != '') {

            $query_04 = "UPDATE frete set 
	status ='$tratativa' WHERE id='$id_frete'";
            $sql->query($query_04);

        } elseif ($pendente != '') {

            $query_04 = "UPDATE frete set 
	status ='$pendente' WHERE id='$id_frete'";
            $sql->query($query_04);

        } elseif ($transito != '') {

            $query_04 = "UPDATE frete set 
	status ='$transito' WHERE id='$id_frete'";
            $sql->query($query_04);

        } elseif ($aberto != '') {

            $query_04 = "UPDATE frete set 
	status ='$aberto' WHERE id='$id_frete'";
            $sql->query($query_04);

        } elseif ($entregue != '') {

            $query_04 = "UPDATE frete set 
	status ='$entregue' WHERE id='$id_frete'";
            $sql->query($query_04);

        } elseif ($finalizado != '') {

            $query_04 = "UPDATE frete set 
	status ='$finalizado' WHERE id='$id_frete'";
            $sql->query($query_04);

        }
    }


    $url = SITE_URL . 'administrativo.php?link=4050';

    $sql->commit();
    if ($sql->hasErros()) {
        throw new Exception($sql->getErros());
    }
    $output = array(
        'error' => 0,
        'retorno' => '',
        'url' => $url
    );
} catch
(Exception $e) {
    $output = array(
        'error' => 1,
        'retorno' => $e->getMessage()
    );
} catch (Throwable $t) {
    $output = array(
        'error' => 1,
        'retorno' => $t->getMessage()
    );
} finally {
    header("Content-Type: application/json");
    echo json_encode($output);
}