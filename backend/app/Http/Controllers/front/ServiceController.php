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
        return response()->json([
            'status'=>true,
            'data'=>$services
        ]);
    }

    //This Method will return latest servies
    public function latestservices(Request $request){
        $services = Service::where('status',1)
                    ->take($request->get('limit'))
                    ->orderBy('created_at','DESC')->get();
        
        return response()->json([
            'status'=>true,
            'data'=> $services
        ]);
    
    }
}
