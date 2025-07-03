<?php
include_once("../../../conectar.php");
include_once("../../../includes/Sql.php");
set_time_limit(10000);

$id_manifesto 		= $_POST["id_manifesto"];
$id_motorista 		= $_POST["id_motorista"];

$data_saida			= $_POST["data_saida"];
$hora_saida			= $_POST["hora_saida"];

$data_transito		= $_POST["data_saida"];
$hora_transito		= $_POST["hora_saida"];

$data_ocorrencia	= $_POST["data_saida"];
$hora_ocorrencia	= $_POST["hora_saida"];

$formato_data = "Y-m-d";
$id_usuario = $_SESSION['usuarioId'];
$dt_cadastro = date("Y-m-d H:i:s");

$sql = new Sql($conn);
$sql->startTransaction();

try {

	if (empty($id_manifesto)) {
        throw new Exception('Erro campo id_manifesto, acione o suporte.');
    }
	
	if (empty($data_saida)) {
        throw new Exception('Erro campo data_saida, acione o suporte.');
    }

    $date = DateTime::createFromFormat($formato_data, $data_saida);
    if ($date && $date->format($formato_data) == $data_saida) {
    } else {
        throw new Exception('Data Saída Invalida .');
    }


    if (empty($hora_saida)) {
        throw new Exception('Erro campo hora_saida, acione o suporte.');
    }
	
	if (empty($data_transito)) {
        throw new Exception('Erro campo data_transito, acione o suporte.');
    }
	
	if (empty($hora_transito)) {
        throw new Exception('Erro campo hora_transito, acione o suporte.');
    }

    if (empty($data_ocorrencia)) {
        throw new Exception('Erro campo data_ocorrencia, acione o suporte.');
    }

    if (empty($hora_ocorrencia)) {
        throw new Exception('Erro campo hora_ocorrencia, acione o suporte.');
    }

    if (empty($id_usuario)) {
        throw new Exception('Sessão Expirada.');
    }

    $verify_movimento = mysqli_query($conn, "SELECT
	manifesto.id
	FROM manifesto 
	WHERE manifesto.id = '{$id_manifesto}' and manifesto.total_movimento = 0 ");
    $resultado = mysqli_fetch_assoc($verify_movimento);
    if ($verify_movimento->num_rows > 0) {
        throw new Exception('Sem Frete ou Coleta adicionado');
    }


    $pesquisar_documento_frete = "SELECT 
	frete_documento.id_frete,
	frete_documento. id as id_documento
	FROM frete_documento 
	LEFT JOIN manifesto_movimento ON manifesto_movimento.id_movimento = frete_documento.id_frete and manifesto_movimento.id_tipo_movimento != 3
	WHERE manifesto_movimento.id_manifesto = '{$id_manifesto}' and manifesto_movimento.status != 10 ";
    $resultado_documento_frete = mysqli_query($conn, $pesquisar_documento_frete);
    $id_frete = '';
    $id_documento = '';
    while ($documento_frete = mysqli_fetch_assoc($resultado_documento_frete)) {
        $id_frete = $documento_frete['id_frete'];
        $id_documento = $documento_frete['id_documento'];

        $pesquisar_data = "SELECT 
            data_ocorrencia, 
            hora_ocorrencia  
            FROM ocorrencia_movimento 
            WHERE id_documento = '" . $id_documento . "' and id_movimento  = '{$id_frete}' and ocorrencia_movimento.status !=10 ORDER BY id DESC";
        $resultado_data = mysqli_query($conn, $pesquisar_data);
        $data = mysqli_fetch_assoc($resultado_data);

        $data_hora = $data['data_ocorrencia'] . ' ' . $data['hora_ocorrencia'];
        $data_hora = date('Y-m-d H:i', strtotime($data_hora));

        $data_hora = strtotime($data_hora);
        $data_hora_ocorrencia = $data_ocorrencia . ' ' . $hora_ocorrencia;
        $data_hora_ocorrencia = strtotime($data_hora_ocorrencia);

        if ($data_hora_ocorrencia <= $data_hora) {
            throw new Exception("Data de Saida Menor que Data da Ultima Ocorrência - Frete {$id_frete}");
        }

    }

    $pesquisar_documento_coleta = "SELECT 
	coleta_documento.id_coleta,
	coleta_documento. id as id_documento
	FROM coleta_documento 
	LEFT JOIN manifesto_movimento ON manifesto_movimento.id_movimento = coleta_documento.id_coleta and manifesto_movimento.id_tipo_movimento = 3
	WHERE manifesto_movimento.id_manifesto = '{$id_manifesto}' and manifesto_movimento.status != 10 ";
    $resultado_documento_coleta = mysqli_query($conn, $pesquisar_documento_coleta);
    $id_coleta = '';
    $id_documento = '';
    while ($documento_coleta = mysqli_fetch_assoc($resultado_documento_coleta)) {
        $id_coleta = $documento_coleta['id_coleta'];
        $id_documento = $documento_coleta['id_documento'];

        $pesquisar_data = "SELECT 
            data_ocorrencia, 
            hora_ocorrencia  
            FROM ocorrencia_movimento 
            WHERE id_documento = '" . $id_documento . "' and id_movimento  = '{$id_coleta}' and ocorrencia_movimento.status !=10 ORDER BY id DESC";
        $resultado_data = mysqli_query($conn, $pesquisar_data);
        $data = mysqli_fetch_assoc($resultado_data);

        $data_hora = $data['data_ocorrencia'] . ' ' . $data['hora_ocorrencia'];
        $data_hora = date('Y-m-d H:i', strtotime($data_hora));

        $data_hora = strtotime($data_hora);
        $data_hora_ocorrencia = $data_ocorrencia . ' ' . $hora_ocorrencia;
        $data_hora_ocorrencia = strtotime($data_hora_ocorrencia);

        if ($data_hora_ocorrencia <= $data_hora) {
            throw new Exception("Data de Saida Menor que Data da Ultima Ocorrência - Coleta {$id_coleta}");
        }

    }


	
	$verify_coleta = mysqli_query($conn, "SELECT
	manifesto_movimento.id,
	manifesto_movimento.id_movimento as id_coleta,
	status_movimento.nome as nome_status
	FROM manifesto_movimento 
	LEFT JOIN ocorrencia_movimento ON ocorrencia_movimento.id_movimento = manifesto_movimento.id_movimento and ocorrencia_movimento.id_tipo_movimento = 3
	LEFT JOIN status_movimento ON status_movimento.id = ocorrencia_movimento.tipo_acao
	WHERE manifesto_movimento.id_manifesto = '{$id_manifesto}' and 
	manifesto_movimento.id_tipo_movimento = 3 and
	(ocorrencia_movimento.tipo_acao = 5 or ocorrencia_movimento.tipo_acao = 6 or ocorrencia_movimento.tipo_acao = 7) and 
	manifesto_movimento.status !=10 and ocorrencia_movimento.status !=10");
    $resultado = mysqli_fetch_assoc($verify_coleta);
    if ($verify_coleta->num_rows > 0) {
        throw new Exception("Ação Não Permitida - Coleta N° {$resultado['id_coleta']} Possue Documeto com Status {$resultado['nome_status']}");
    }
	
	$verify_frete = mysqli_query($conn, "SELECT
	manifesto_movimento.id,
	manifesto_movimento.id_movimento as id_frete,
	status_movimento.nome as nome_status
	FROM manifesto_movimento 
	LEFT JOIN ocorrencia_movimento ON ocorrencia_movimento.id_movimento = manifesto_movimento.id_movimento and ocorrencia_movimento.id_tipo_movimento = 13
	LEFT JOIN status_movimento ON status_movimento.id = ocorrencia_movimento.tipo_acao
	WHERE manifesto_movimento.id_manifesto = '{$id_manifesto}' and 
	manifesto_movimento.id_tipo_movimento != 3 and
	(ocorrencia_movimento.tipo_acao = 6 or ocorrencia_movimento.tipo_acao = 7 or ocorrencia_movimento.tipo_acao = 8 or ocorrencia_movimento.tipo_acao = 9 or ocorrencia_movimento.tipo_acao = 12) and 
	manifesto_movimento.status !=10 and ocorrencia_movimento.status !=10 ");
    $resultado = mysqli_fetch_assoc($verify_frete);
    if ($verify_frete->num_rows > 0) {
        throw new Exception("Ação Não Permitida - Frete N° {$resultado['id_frete']} Possue Documeto com Status {$resultado['nome_status']}");
    }
	
	$query_00 = "UPDATE manifesto set 
	data_saida		='$data_saida',
	hora_saida		='$hora_saida',
	status          ='4',
	id_modificacao  ='$id_usuario',
	dt_modificacao  ='$dt_cadastro' WHERE id='$id_manifesto'";
    $sql->query($query_00);
	
	$query_01 = "UPDATE minuta set 
	status          ='4' WHERE id_manifesto='$id_manifesto'";
    $sql->query($query_01);
	
	$pesquisar_data = "SELECT data, hora, data_saida, hora_saida FROM manifesto WHERE id = '" . $id_manifesto . "' ";
    $resultado_data = mysqli_query($conn, $pesquisar_data);
    $listar_data = mysqli_fetch_assoc($resultado_data);
    $data_criacao 	= $listar_data['data']. ' '. $listar_data['hora'];
	$data_saida 	= $listar_data['data_saida']. ' '. $listar_data['hora_saida'];
	$data_criacao = strtotime($data_criacao);
	$data_saida = strtotime($data_saida);
	$data_resultado = ($data_saida - $data_criacao);
	
	if ($data_resultado <= 0) {
        throw new Exception('Data de Saida Menor que a Data do Manifesto');
    }
	
	$pesquisar_coleta = "SELECT 
	coleta_documento.id_coleta,
	coleta_documento. id as id_documento
	FROM coleta_documento 
	LEFT JOIN manifesto_movimento ON manifesto_movimento.id_movimento = coleta_documento.id_coleta and manifesto_movimento.id_tipo_movimento = 3
	WHERE manifesto_movimento.id_manifesto = '{$id_manifesto}' and manifesto_movimento.status != 10 ";
    $resultado_coleta = mysqli_query($conn, $pesquisar_coleta);
    $id_coleta = '';
	$id_documento = '';
    while ($coleta = mysqli_fetch_assoc($resultado_coleta)) {
        $id_coleta = $coleta['id_coleta'];
		$id_documento = $coleta['id_documento'];
	
	if (empty($id_coleta)) {
        throw new Exception('Erro campo id_coleta, acione o suporte.');
    }
	if (empty($id_documento)) {
        throw new Exception('Erro campo id_documento, acione o suporte.');
    }
	
    $query_02 = "UPDATE coleta set 
	status          ='4',
	data_transito	='$data_transito',
	hora_transito	='$hora_transito',
	id_motorista	='$id_motorista' WHERE id='$id_coleta'";
    $sql->query($query_02);
	
	$query_03 = "UPDATE coleta_documento set 
	tipo_acao          ='4' WHERE id_coleta='$id_coleta'";
    $sql->query($query_03);
	
	$query_04 = "INSERT INTO ocorrencia_movimento (
	id_movimento,
	id_tipo_movimento,
	id_documento,
	id_ocorrencia,
	tipo_acao,
	data_ocorrencia,
	hora_ocorrencia,
	id_usuario,
	dt_cadastro) VALUES (
	'$id_coleta',
	'3',
	'$id_documento',
	'2',
	'4',
	'$data_ocorrencia',
	'$hora_ocorrencia',
	'$id_usuario',
	'$dt_cadastro')";
	$sql->query($query_04);

    }
	
	
	$pesquisar_frete = "SELECT 
	frete_documento.id_frete,
	frete_documento. id as id_documento
	FROM frete_documento 
	LEFT JOIN manifesto_movimento ON manifesto_movimento.id_movimento = frete_documento.id_frete and manifesto_movimento.id_tipo_movimento != 3
	WHERE manifesto_movimento.id_manifesto = '{$id_manifesto}' and manifesto_movimento.status != 10 ";
    $resultado_frete = mysqli_query($conn, $pesquisar_frete);
    $id_frete = '';
	$id_documento = '';
    while ($frete = mysqli_fetch_assoc($resultado_frete)) {
        $id_frete = $frete['id_frete'];
		$id_documento = $frete['id_documento'];
	
	if (empty($id_frete)) {
        throw new Exception('Erro campo id_frete, acione o suporte.');
    }
	if (empty($id_documento)) {
        throw new Exception('Erro campo id_documento, acione o suporte.');
    }
	
    $query_02 = "UPDATE frete set 
	status          ='4',
	id_motorista	='$id_motorista' WHERE id='$id_frete'";
    $sql->query($query_02);
	
	$query_03 = "UPDATE frete_documento set 
	tipo_acao          ='4' WHERE id_frete='$id_frete'";
    $sql->query($query_03);
	
	$query_04 = "INSERT INTO ocorrencia_movimento (
	id_movimento,
	id_tipo_movimento,
	id_documento,
	id_ocorrencia,
	tipo_acao,
	data_ocorrencia,
	hora_ocorrencia,
	id_usuario,
	dt_cadastro) VALUES (
	'$id_frete',
	'13',
	'$id_documento',
	'2',
	'4',
	'$data_ocorrencia',
	'$hora_ocorrencia',
	'$id_usuario',
	'$dt_cadastro')";
	$sql->query($query_04);

    }

    $url = SITE_URL . 'administrativo.php?link=4040';
	
    $sql->commit();
    if ($sql->hasErros()) {
        throw new Exception($sql->getErros());
    }
    $output = array(
        'error' => 0,
        'retorno' => $id_manifesto,
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