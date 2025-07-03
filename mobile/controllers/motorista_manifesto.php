<?php
if (!isset($_SESSION)) {
    session_start();
}
function getConsultaFiltroPesquisaManifestoMotorista($pagina, $qnt_result_pg)
{
$start = ($pagina - 1) * $qnt_result_pg;

$pesquisar = 'SELECT 
manifesto.id,
manifesto.id_motorista,
manifesto.status as status_manifesto
FROM manifesto
LEFT JOIN status_movimento ON status_movimento.id = manifesto.status';
$pesquisarCount = 'SELECT COUNT(1) AS num_result 
FROM manifesto 
LEFT JOIN status_movimento ON status_movimento.id = manifesto.status
WHERE manifesto.id_motorista =  "' . $_SESSION['usuarioIdCliente'] . '" and manifesto.id_motorista != 10 ';

if (!empty($_POST['filtros'])) {
$filtros = $_POST['filtros'];
$sql = '';

// unidade
if ( !empty($filtros['id_manifesto'])) {
if ( !empty($sql)) {
$sql .= 'AND ';
}
$sql .= 'manifesto.id = "' . $filtros['id_manifesto'] . '" ';
}


// Status
if ( !empty($filtros['id_status'])) {
if ( !empty($sql)) {
$sql .= 'AND ';
}
$sql .= 'manifesto.status = "' . $filtros['id_status'] . '" ';
}


if (!empty($sql)) {
$pesquisar .= ' WHERE manifesto.id_motorista =  "' . $_SESSION['usuarioIdCliente'] . '" and manifesto.id_motorista != 10 AND ' . $sql;
$pesquisarCount .= ' AND ' . $sql;
$pesquisar .= "ORDER BY manifesto.id DESC LIMIT $start, $qnt_result_pg";
} else {
$pesquisar = "SELECT 
manifesto.id,
manifesto.id_motorista,
manifesto.status as status_manifesto
FROM manifesto
LEFT JOIN status_movimento ON status_movimento.id = manifesto.status
WHERE manifesto.id_motorista =  '" . $_SESSION['usuarioIdCliente'] . "' and manifesto.id_motorista != 10 ORDER BY manifesto.id DESC LIMIT $start, $qnt_result_pg";
$pesquisarCount = "SELECT COUNT(1) AS num_result 
FROM manifesto
LEFT JOIN status_movimento ON status_movimento.id = manifesto.status
WHERE manifesto.id_motorista =  '" . $_SESSION['usuarioIdCliente'] . "' and manifesto.id_motorista != 10 ";
}
} else {
$pesquisar = "SELECT 
manifesto.id,
manifesto.id_motorista,
manifesto.status as status_manifesto
FROM manifesto
LEFT JOIN status_movimento ON status_movimento.id = manifesto.status
WHERE manifesto.id_motorista =  '" . $_SESSION['usuarioIdCliente'] . "' and manifesto.id_motorista != 10 ORDER BY manifesto.id DESC LIMIT $start, $qnt_result_pg";
$pesquisarCount = "SELECT COUNT(1) AS num_result 
FROM manifesto
LEFT JOIN status_movimento ON status_movimento.id = manifesto.status
WHERE manifesto.id_motorista =  '" . $_SESSION['usuarioIdCliente'] . "' and manifesto.id_motorista != 10 ";
}
$_SESSION['consultaSession'] = $pesquisar;
return array(
'sqlBusca' => $pesquisar,
'sqlCount' => $pesquisarCount
);
}
