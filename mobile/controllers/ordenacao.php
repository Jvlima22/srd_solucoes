<?php

include_once (dirname(dirname(dirname(__FILE__))) . '/settings.php');

include_once(PATH . "/sistema/conectar.php");
require_once PATH . '/sistema/StringBuilder.php';

class Ordenacao
{

    function __construct()
    {
        if (method_exists($this, $_REQUEST['action'])) {
            call_user_func(array(
                $this,
                $_REQUEST['action']
            ));
        }
    }

    protected function getOrdenation($request)
    {
        return [
            'field' => $request->columns[$request->order[0]['column']]['name'],
            'order' => $request->order[0]['dir']
        ];
    }
}