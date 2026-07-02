<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;


class ServiceController extends Controller
{
    //This Method return all Active Services
    public function index(){
        $services = Service::where('status',1)->orderBy('created_at', 'desc')->get();
        return $services;
    }
}
