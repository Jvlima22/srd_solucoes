<?php
include_once("../../../conectar.php");
include_once("../../../includes/Sql.php");

include_once SISTEMA_ROOT . '/lib/SistemaSrp/HistoricoMovimento/HistoricoMovimento.php';
include_once SISTEMA_ROOT . '/lib/SistemaSrp/Comprovante/Comprovante.php';
include_once SISTEMA_ROOT . '/WideImage/WideImage.php';

use \SistemaSrp\Comprovante\Comprovante as Comprovante;


set_time_limit(10000);


$id_manifesto  				= $_POST["id_manifesto"];
$id_motorista  				= $_POST["id_motorista"];
$id_ocorrencia_movimento  	= $_POST["id_ocorrencia_movimento"];
$id_tipo_movimento 			= $_POST["id_tipo_movimento"];
$id_ocorrencia 				= $_POST["id_ocorrencia"];
$informar_recebedor 		= $_POST["informar_recebedor"];
$comprovante 		        = $_POST["comprovante"];
$id_frete 					= $_POST["id_frete"];
$id_despacho                = $_POST["id_despacho"];

$id_usuario = $_SESSION['usuarioId'];
$dt_cadastro = date("Y-m-d H:i:s");

$data_historico = date("Y-m-d");
$hora_historico = date("H:i:s");

$sql = new Sql($conn);
$sql->startTransaction();

try {

    if (empty($id_motorista)) {
        throw new Exception('Erro campo id_motorista, acione o suporte.');
    }

    if (empty($id_ocorrencia_movimento)) {
        throw new Exception('Erro campo id_ocorrencia_movimento, acione o suporte.');
    }


    if (empty($id_tipo_movimento)) {
        throw new Exception('Erro campo id_tipo_movimento, acione o suporte.');
    }

    if (empty($id_ocorrencia)) {
        throw new Exception('Erro campo id_ocorrencia, acione o suporte.');
    }

    if (empty($informar_recebedor)) {
        throw new Exception('Erro campo informar_recebedor, acione o suporte.');
    }

    if (empty($id_frete)) {
        throw new Exception('Erro campo id_frete, acione o suporte.');
    }

    if (empty($id_despacho)) {
        throw new Exception('Erro campo id_despacho, acione o suporte.');
    }

    $verify_fatura = mysqli_query($conn, "SELECT
	frete.id,
	frete.id_fatura
	FROM frete 
	WHERE frete.id = '{$id_frete}' and frete.id_fatura != 0 ");
    $resultado = mysqli_fetch_assoc($verify_fatura);
    if ($verify_fatura->num_rows > 0) {
        throw new Exception("Ação Não Permitida - Frete N° {$resultado['id']} Vinculado a Fatura {$resultado['id_fatura']}");
    }

    $query_01 = "UPDATE ocorrencia_movimento set 
	status ='10' WHERE id_ocorrencia='$id_ocorrencia' and id_movimento='$id_frete' and id_tipo_movimento=17 and id_motorista='$id_motorista'";
    $sql->query($query_01);

    $query_02 = "INSERT INTO historico_frete (
id_movimento,
id_vinculado,
tipo_movimento,
descricao,
data_historico,
hora_historico,
id_usuario,
dt_cadastro) VALUES (
'$id_frete',
'$id_ocorrencia',
'18',
'6',
'$data_historico',
'$hora_historico',
'$id_usuario',
'$dt_cadastro')";
    $sql->query($query_02);

    $pesquisar_documento = "SELECT 
    frete_documento.id,
    frete_documento.id_frete
    FROM frete_documento 
    LEFT JOIN minuta_movimento ON minuta_movimento.id_frete = frete_documento.id_frete
    LEFT JOIN minuta ON minuta.id = minuta_movimento.id_minuta
    WHERE  frete_documento.id_frete = '{$id_frete}' and minuta_movimento.id_minuta = '{$id_despacho}' and minuta.id_motorista = '{$id_motorista}'";
    $resultado_documento = mysqli_query($conn, $pesquisar_documento);
    $id_documento = '';
    $id_frete = '';
    while ($documento = mysqli_fetch_assoc($resultado_documento)) {
        $id_documento = $documento['id'];
        $id_frete = $documento['id_frete'];

        if (empty($id_documento)) {
            throw new Exception('Erro campo id_documento, acione o suporte');
        }

        if (empty($id_frete)) {
            throw new Exception('Erro campo id_frete, acione o suporte');
        }

        $pesquisar_ocorrencia = "SELECT
	ocorrencia_movimento.tipo_acao,
	ocorrencia_movimento.id_ocorrencia
	FROM ocorrencia_movimento 
	WHERE ocorrencia_movimento.id_documento = '" . $id_documento . "' and 
	ocorrencia_movimento.id_movimento  = '{$id_frete}' and 
	ocorrencia_movimento.status != 10  and 
	(ocorrencia_movimento.id_tipo_movimento != 3)
	 ORDER BY ocorrencia_movimento.id DESC LIMIT 1";
        $resultado_ocorrencia = mysqli_query($conn, $pesquisar_ocorrencia);
        $resultado = mysqli_fetch_assoc($resultado_ocorrencia);
        $tipo_acao = $resultado['tipo_acao'];
        $id_ocorrencia = $resultado['id_ocorrencia'];


        if (empty($tipo_acao)) {
            throw new Exception('Erro campo tipo_acao, acione o suporte.');
        }

        if (empty($id_ocorrencia)) {
            throw new Exception('Erro campo id_ocorrencia, acione o suporte.');
        }

        $query_02 = "UPDATE frete_documento set 
	tipo_acao ='$tipo_acao',
	id_ocorrencia ='$id_ocorrencia'	WHERE id='$id_documento'";
        $sql->query($query_02);

        if ($informar_recebedor = 1) {
            $query_03 = "UPDATE frete_documento set 
	recebedor ='',
	documento_recebedor ='',
	id_tipo_recebedor ='0' WHERE id='$id_documento'";
            $sql->query($query_03);
        }
    }

    $query_02 = "UPDATE minuta_movimento set 
status ='$tipo_acao' WHERE id_frete='$id_frete'";
    $sql->query($query_02);

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

        $query_04 = "UPDATE minuta set 
	status ='$tratativa' WHERE id='$id_despacho'";
        $sql->query($query_04);

    } elseif ($pendente != '') {

        $query_04 = "UPDATE minuta set 
	status ='$pendente' WHERE id='$id_despacho'";
        $sql->query($query_04);

    } elseif ($transito != '') {

        $query_04 = "UPDATE minuta set 
	status ='$transito' WHERE id='$id_despacho'";
        $sql->query($query_04);

    } elseif ($aberto != '') {

        $query_04 = "UPDATE minuta set 
	status ='$aberto' WHERE id='$id_despacho'";
        $sql->query($query_04);

    } elseif ($entregue != '') {

        $query_04 = "UPDATE minuta set 
	status ='$entregue' WHERE id='$id_despacho'";
        $sql->query($query_04);

    } elseif ($finalizado != '') {

        $query_04 = "UPDATE minuta set 
	status ='$finalizado' WHERE id='$id_despacho'";
        $sql->query($query_04);

    }

    if (empty($id_ocorrencia_movimento)) {
        $sucesso = false;
        $msg = 'Nenhum id de movimento informado.';
    } else if (empty($id_tipo_movimento)) {
        $sucesso = false;
        $msg = 'Nenhum tipo de movimento informado.';
    } else {
        $id_ocorrencia_movimento = $id_ocorrencia_movimento;
        $id_tipo_movimento = $id_tipo_movimento;

        $comprovantes = Comprovante::getComprovantesPorMovimento($conn, $id_ocorrencia_movimento, $id_tipo_movimento);

        foreach ($comprovantes as $comprovante) {
            if (file_exists(COMPROVANTES_DIR . $comprovante['arquivo'])) {
                unlink(COMPROVANTES_DIR . $comprovante['arquivo']);
                $arquivo = explode(".", $comprovante['arquivo']);
                $extensao = array_pop($arquivo);
                unlink(COMPROVANTES_DIR . str_replace("." . $extensao, "", $comprovante['arquivo']) . '-reduzido.jpg');
            }

            $query_00 = "DELETE FROM comprovante_movimento WHERE id_movimento ='" . $id_ocorrencia_movimento . "' and id_tipo_movimento ='" . $id_tipo_movimento . "' ";
            $sql->query($query_00);

            $query_01 = "UPDATE ocorrencia_movimento set 
	        comprovante  ='0' WHERE id ='$id_ocorrencia_movimento' and id_tipo_movimento ='" . $id_tipo_movimento . "'";
            $sql->query($query_01);

        }

    }

    $url = SITE_URL . 'administrativo.php?link=4070';
    $sql->commit();
    if ($sql->hasErros()) {
        throw new Exception($sql->getErros());
    }
    $output = array(
        'error' => 0,
        'retorno' => $id_frete,
        'url' => $url
    );
} catch (Exception $e) {
    $output = array(
        'error' => 1,
        'retorno' => $e->getMessage()
    );
} finally {
    header("Content-Type: application/json");
    echo json_encode($output);
}